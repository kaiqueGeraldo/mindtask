CREATE TABLE usuarios (
  id INT PRIMARY KEY IDENTITY(1,1),
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em DATETIME DEFAULT GETDATE(),
  token_recuperacao VARCHAR(255), 
  token_expira_em DATETIME
);

CREATE TABLE contas_vinculadas (
    id INT PRIMARY KEY IDENTITY,
    dono_id INT NOT NULL, 
    conta_vinculada_id INT NOT NULL,
    aprovada BIT DEFAULT 0,
	criado_em DATETIME DEFAULT GETDATE(),
	aprovado_em DATETIME NULL,
    FOREIGN KEY (dono_id) REFERENCES usuarios(id),
    FOREIGN KEY (conta_vinculada_id) REFERENCES usuarios(id)
);

CREATE TABLE grupos_projeto (
  id INT PRIMARY KEY IDENTITY(1,1),
  usuario_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  ordem INT DEFAULT 0,
  expandido BIT NOT NULL DEFAULT 1,
  criado_em DATETIME DEFAULT GETDATE(),

  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE projetos (
  id INT PRIMARY KEY IDENTITY(1,1),
  usuario_id INT NOT NULL,
  grupo_id INT NULL,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  status INT DEFAULT 0 CHECK (status IN (0, 1, 2, 3)),
  favorito BIT DEFAULT 0,
  ordem INT DEFAULT 0,
  criado_em DATETIME DEFAULT GETDATE(),
  atualizado_em DATETIME DEFAULT GETDATE(),
  concluido_em DATETIME DEFAULT GETDATE(),

  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (grupo_id) REFERENCES grupos_projeto(id)
);

CREATE TABLE tecnologias (
  id INT PRIMARY KEY IDENTITY(1,1),
  nome VARCHAR(50) UNIQUE NOT NULL,
  categoria VARCHAR(50)
);

CREATE TABLE projeto_tecnologia (
  projeto_id INT,
  tecnologia_id INT,
  PRIMARY KEY (projeto_id, tecnologia_id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id),
  FOREIGN KEY (tecnologia_id) REFERENCES tecnologias(id)
);

CREATE TABLE tarefas (
  id INT PRIMARY KEY IDENTITY(1,1),
  projeto_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  feito BIT DEFAULT 0,
  ordem_pendente INT,
  ordem_concluida INT,
  criado_em DATETIME DEFAULT GETDATE(),

  FOREIGN KEY (projeto_id) REFERENCES projetos(id)
);