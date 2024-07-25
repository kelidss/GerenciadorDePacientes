# API de Gerenciamento de Pacientes - Kompa

# Descrição

O projeto é uma aplicação de gestão de pacientes que inclui uma API para gerenciamento de dados e uma interface web para visualização e interação com esses dados. Utiliza tecnologias modernas tanto no backend quanto no frontend para fornecer uma solução robusta e eficiente.

# Como Configurar:

## Configuração do Ambiente Python

### Crie e ative um ambiente virtual:

- `python -m venv venv`

### Instale as dependências necessárias:

- `pip install -r requirements.txt`

## Configuração do Ambiente:

 Crie um arquivo `.env` com base no arquivo `.env-example`. Este arquivo é necessário para definir variáveis de ambiente que configuram a API Python e o `docker-compose.yml`.

## Configuração do Banco de Dados:

### Inicie o PostgreSQL usando Docker Compose:

- `docker-compose up -d`

## Execução da API:

### Execute a API Python localizada em API/api.py:

- `python API/api.py`

### Execução do Frontend:

 Abra o arquivo `index.html` em um navegador web para visualizar a interface de usuário e interagir com a aplicação.

# Tecnologias Usadas

## Backend

**Python** : Linguagem de programação para o desenvolvimento da API.

**Flask** : Framework para desenvolvimento web, usado para criar a API.

**SQLAlchemy** : ORM para gerenciamento e interação com o banco de dados PostgreSQL.

**Dotenv** : Biblioteca para carregar variáveis de ambiente a partir do arquivo .env.

## Frontend

**HTML** : Linguagem de marcação usada para estruturar o conteúdo da página.

**CSS** : Linguagem de estilo para definir o layout e design da interface.

**JavaScript** : Linguagem de script para adicionar funcionalidades interativas à interface web.

## Banco de Dados

**PostgreSQL** : Sistema de gerenciamento de banco de dados relacional usado para armazenar os dados da aplicação.

**Docker Compose** : Ferramenta para definir e executar aplicativos Docker multi-contêiner, utilizada para a configuração e execução do banco de dados.

