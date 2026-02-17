const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const { createClient } = require('redis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'mueblesdaso-secret-key-2026';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'mueblesdaso_erp'}`,
});

// Redis Client
const redisClient = createClient({
    url: REDIS_URL
});

redisClient.on('error', (err) => console.log('❌ Redis Client Error', err));

// Connect Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis conectado exitosamente');
    } catch (e) {
        console.error('❌ Error conectando a Redis:', e);
    }
})();

// Test Connection and Init Tables
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err);
    } else {
        console.log('✅ PostgreSQL conectado exitosamente');
    }
});

// --- AUTH ROUTES ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT u.*, r.nombre as rol_nombre FROM app_users u JOIN app_roles r ON u.rol_id = r.id WHERE u.email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        // En un sistema real usaríamos bcrypt.compare
        // Para el mock inicial aceptamos 'password123'
        if (password !== 'password123') {
            // return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol_nombre },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol_nombre
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// --- CLIENTS ROUTES ---
app.get('/api/clientes', async (req, res) => {
    try {
        // Nota: Aquí mapearíamos a tu tabla real de clientes 'cat_clientes'
        // Por ahora usamos una consulta simple
        const result = await pool.query('SELECT * FROM app_users WHERE rol_id = (SELECT id FROM app_roles WHERE nombre = \'COBRANZA\')');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- PAYMENTS ROUTES ---
app.post('/api/pagos', async (req, res) => {
    const { clientId, amount, paymentMethod, collectorId, location } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO app_transactions (tipo, cliente_id, monto, user_id, metodo_pago, notas) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            ['PAGO', typeof clientId === 'number' ? clientId : 1, amount, collectorId || 'U01', paymentMethod, `Ubicación: ${JSON.stringify(location)}`]
        );

        res.json({
            success: true,
            paymentId: `PAY-${result.rows[0].id}`,
            message: 'Pago registrado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- INVENTORY ROUTES ---
app.get('/api/inventario', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM app_inventory');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/inventario/:id', async (req, res) => {
    const { id } = req.params;
    const { stock_actual } = req.body;
    try {
        await pool.query('UPDATE app_inventory SET current_stock = $1 WHERE sku = $2', [stock_actual, id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// HEALTH CHECK
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
});
