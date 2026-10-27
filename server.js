const express = require('express');
const cors = require('cors');
const conexao = require('./db');

const app = express();
const PORTA = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'API do RecycleWear funcionando!'
    });
});

app.get('/usuario', (req, res) => {
    conexao.query('SELECT * FROM usuario', (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao listar usuários.' });
        }

        res.status(200).json(resultado);
    });
});

app.get('/usuario/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID do usuário inválido.' });
    }

    conexao.query('SELECT * FROM usuario WHERE id_usuario = ?', [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao buscar usuário.' });
        }
        if (resultado.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        res.status(200).json(resultado[0]);
    });
});

app.post('/usuario', (req, res) => {
    const { nome, email, senha, cpf } = req.body || {};
    if (typeof nome !== 'string' || nome.trim().length === 0 ||
        typeof email !== 'string' || email.trim().length === 0 ||
        typeof senha !== 'string' || senha.length === 0 ||
        typeof cpf !== 'string' || cpf.trim().length === 0) {
        return res.status(400).json({ erro: 'Nome, email, senha e CPF são obrigatórios.' });
    }

    const sql = 'INSERT INTO usuario (nome, email, senha, cpf) VALUES (?, ?, ?, ?)';
    conexao.query(sql, [nome.trim(), email.trim(), senha, cpf.trim()], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
        }

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso.',
            id_usuario: resultado.insertId
        });
    });
});

app.put('/usuario/:id', (req, res) => {
    const id = Number(req.params.id);
    const { nome, email, senha, cpf } = req.body || {};
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID do usuário inválido.' });
    }
    if (typeof nome !== 'string' || nome.trim().length === 0 ||
        typeof email !== 'string' || email.trim().length === 0 ||
        typeof senha !== 'string' || senha.length === 0 ||
        typeof cpf !== 'string' || cpf.trim().length === 0) {
        return res.status(400).json({ erro: 'Nome, email, senha e CPF são obrigatórios.' });
    }

    const sql = 'UPDATE usuario SET nome = ?, email = ?, senha = ?, cpf = ? WHERE id_usuario = ?';
    const valores = [nome.trim(), email.trim(), senha, cpf.trim(), id];
    conexao.query(sql, valores, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
        }
        if (resultado.affectedRows === 0) {
            return conexao.query('SELECT id_usuario FROM usuario WHERE id_usuario = ?', [id], (erroBusca, usuarios) => {
                if (erroBusca) {
                    return res.status(500).json({ erro: 'Erro ao verificar usuário.' });
                }
                if (usuarios.length === 0) {
                    return res.status(404).json({ erro: 'Usuário não encontrado.' });
                }

                res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' });
            });
        }

        res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' });
    });
});

app.delete('/usuario/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID do usuário inválido.' });
    }

    conexao.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao excluir usuário.' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        res.status(200).json({ mensagem: 'Usuário excluído com sucesso.' });
    });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});

