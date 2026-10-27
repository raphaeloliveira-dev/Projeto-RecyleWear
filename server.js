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

app.get('/categoria', (req, res) => {
    conexao.query('SELECT * FROM categoria', (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao listar categoria.' });
        }

        res.status(200).json(resultado);
    });
});

app.get('/categoria/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID da categoria inválido.' });
    }

    conexao.query('SELECT * FROM categoria WHERE id_categoria = ?', [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao buscar categoria.' });
        }
        if (resultado.length === 0) {
            return res.status(404).json({ erro: 'Categoria não encontrada.' });
        }

        res.status(200).json(resultado[0]);
    });
});

app.post('/categoria', (req, res) => {
    const { nome, descricao} = req.body || {};
    if (typeof nome !== 'string' || nome.trim().length === 0 ||
        typeof descricao !== 'string' || descricao.trim().length === 0) {
        return res.status(400).json({ erro: 'Nome e descrição são obrigatórios.' });
    }

    const sql = 'INSERT INTO categoria (nome, descricao) VALUES (?, ?)';
    conexao.query(sql, [nome.trim(), descricao.trim()], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao cadastrar categoria.' });
        }

        res.status(201).json({
            mensagem: 'Categoria cadastrado com sucesso.',
            id_categoria: resultado.insertId
        });
    });
});

app.put('/categoria/:id', (req, res) => {
    const id = Number(req.params.id);
    const { nome, descricao} = req.body || {};
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID da categoria inválido.' });
    }
    if (typeof nome !== 'string' || nome.trim().length === 0 ||
        typeof descricao !== 'string' || descricao.trim().length === 0) {
        return res.status(400).json({ erro: 'Nome e descrição são obrigatórios.' });
    }

    const sql = 'UPDATE categoria SET nome = ?, descricao = ? WHERE id_categoria = ?';
    const valores = [nome.trim(), descricao.trim(), id];
    conexao.query(sql, valores, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao atualizar categoria.' });
        }
        if (resultado.affectedRows === 0) {
            return conexao.query('SELECT id_categoria FROM categoria WHERE id_categoria = ?', [id], (erroBusca, categorias) => {
                if (erroBusca) {
                    return res.status(500).json({ erro: 'Erro ao verificar categoria.' });
                }
                if (categorias.length === 0) {
                    return res.status(404).json({ erro: 'Categoria não encontrada.' });
                }

                res.status(200).json({ mensagem: 'Categoria atualizada com sucesso.' });
            });
        }

        res.status(200).json({ mensagem: 'Categoria atualizada com sucesso.' });
    });
});

app.delete('/categoria/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID da categoria inválido.' });
    }

    conexao.query('DELETE FROM categoria WHERE id_categoria = ?', [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao excluir categoria.' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Categoria não encontrada.' });
        }

        res.status(200).json({ mensagem: 'Categoria excluída com sucesso.' });
    });
});

app.get('/produto', (req, res) => {
    conexao.query('SELECT * FROM produto', (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao listar produto.' });
        }

        res.status(200).json(resultado);
    });
});

app.get('/produto/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID do produto inválido.' });
    }

    conexao.query('SELECT * FROM produto WHERE id_produto = ?', [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao buscar produto.' });
        }
        if (resultado.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        res.status(200).json(resultado[0]);
    });
});

app.post('/produto', (req, res) => {
    const { nome, preco, estoque, id_categoria } = req.body || {};
    if (typeof nome !== 'string' || nome.trim().length === 0 ||
        typeof preco !== 'number' || !Number.isFinite(preco) || preco < 0 ||
        !Number.isInteger(estoque) || estoque < 0 ||
        !Number.isInteger(id_categoria) || id_categoria <= 0) {
        return res.status(400).json({ erro: 'Nome, preço, estoque e categoria devem ser válidos.' });
    }

    const sql = 'INSERT INTO produto (nome, preco, estoque, id_categoria) VALUES (?, ?, ?, ?)';
    conexao.query(sql, [nome.trim(), preco, estoque, id_categoria], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
        }

        res.status(201).json({
            mensagem: 'Produto cadastrado com sucesso.',
            id_produto: resultado.insertId
        });
    });
});

app.put('/produto/:id', (req, res) => {
    const id = Number(req.params.id);
    const { nome, preco, estoque, id_categoria } = req.body || {};
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID do produto inválido.' });
    }
    if (typeof nome !== 'string' || nome.trim().length === 0 ||
        typeof preco !== 'number' || !Number.isFinite(preco) || preco < 0 ||
        !Number.isInteger(estoque) || estoque < 0 ||
        !Number.isInteger(id_categoria) || id_categoria <= 0) {
        return res.status(400).json({ erro: 'Nome, preço, estoque e categoria devem ser válidos.' });
    }

    const sql = 'UPDATE produto SET nome = ?, preco = ?, estoque = ?, id_categoria = ? WHERE id_produto = ?';
    const valores = [nome.trim(), preco, estoque, id_categoria, id];
    conexao.query(sql, valores, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao atualizar produto.' });
        }
        if (resultado.affectedRows === 0) {
            return conexao.query('SELECT id_produto FROM produto WHERE id_produto = ?', [id], (erroBusca, produtos) => {
                if (erroBusca) {
                    return res.status(500).json({ erro: 'Erro ao verificar produto.' });
                }
                if (produtos.length === 0) {
                    return res.status(404).json({ erro: 'Produto não encontrado.' });
                }

                res.status(200).json({ mensagem: 'Produto atualizado com sucesso.' });
            });
        }

        res.status(200).json({ mensagem: 'Produto atualizado com sucesso.' });
    });
});

app.delete('/produto/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID do produto inválido.' });
    }

    conexao.query('DELETE FROM produto WHERE id_produto = ?', [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao excluir produto.' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
    });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});