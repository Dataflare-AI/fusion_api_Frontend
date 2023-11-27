    <template>
    <div id="app">
        <div class="card">
        <div id="chooseTable">
            <h2>Escolher Tabela</h2>
            <select v-model="selectedFile" @change="loadTable">
            <option value="">Escolha uma tabela</option>
            <option v-for="fileInfo in fileList" :value="fileInfo" :key="fileInfo.file">
                {{ fileInfo.fileName }}
            </option>
            </select>
            <div v-if="selectedFile">
            <h3>Tabela Selecionada: {{ selectedFile.fileName }}</h3>
            <pre>{{ tableData }}</pre>
            </div>
        </div>

        <div id="configForm">
            <h2>Configuração de Padronização</h2>
            <label for="delimiter">Delimiter:</label>
            <input v-model="delimiter" type="text" id="delimiter" placeholder="Digite o delimitador">

            <label for="headerRow">Número da Linha de Cabeçalho:</label>
            <input v-model="headerRow" type="number" id="headerRow" placeholder="Digite o número da linha de cabeçalho">

            <button @click="applyConfig">Aplicar Configuração</button>
        </div>
        </div>

        <div class="card">
        <h2>Arquivos Importados</h2>
        <ul v-if="showAllFiles">
            <li v-for="fileInfo in fileList" :key="fileInfo.file">
            <a :href="fileInfo.file" :download="getFileName(fileInfo.file)">
                {{ getFileName(fileInfo.file) }}
            </a>
            </li>
        </ul>
        <ul v-else>
            <li v-for="(fileInfo, index) in limitedFileList" :key="index">
            <a :href="fileInfo.file" :download="getFileName(fileInfo.file)">
                {{ getFileName(fileInfo.file) }}
            </a>
            </li>
        </ul>
        <button v-if="!showAllFiles" @click="showAllFiles = true">Mostrar Mais</button>
        </div>
    </div>
    </template>

    <script>
    import axios from 'axios';

    export default {
    data() {
        return {
        fileList: [],
        delimiter: '',
        headerRow: '',
        selectedFile: '',
        tableData: null,
        showAllFiles: false,
        filesToShowInitially: 5, // Defina a quantidade inicial de arquivos a serem exibidos
        };
    },
    computed: {
        limitedFileList() {
        return this.fileList.slice(0, this.filesToShowInitially);
        },
    },
    mounted() {
        this.fetchFileList();
    },
    methods: {
        async fetchFileList() {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/excel-import/');
            this.fileList = response.data.map(fileInfo => ({
            file: fileInfo.file,
            fileName: fileInfo.file.split('/').pop(),
            }));
        } catch (error) {
            console.error('Erro ao buscar a lista de arquivos.', error);
        }
        },
        async applyConfig() {
        console.log('Delimiter:', this.delimiter);
        console.log('Header Row:', this.headerRow);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/excel-import', {
            delimiter: this.delimiter,
            headerRow: this.headerRow,
            });
            console.log('Configuração aplicada com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao enviar a configuração para o backend.', error);
        }
        },
        async loadTable() {
        if (this.selectedFile) {
            try {
            const response = await axios.get(this.selectedFile.file);
            this.tableData = response.data;
            } catch (error) {
            console.error('Erro ao carregar dados da tabela.', error);
            }
        } else {
            this.tableData = null;
        }
        },
        getFileName(fileUrl) {
        return fileUrl.split('/').pop();
        },
    },
    };
    </script>

    <style scoped>
    #app {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    }

    .card {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    }

    #chooseTable,
    #configForm {
    margin-bottom: 20px;
    }

    select,
    input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
    }

    button {
    background-color: #4CAF50;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    }

    button:hover {
    background-color: #45a049;
    }

    ul {
    list-style: none;
    padding: 0;
    }

    ul li {
    margin-bottom: 10px;
    }

    a {
    text-decoration: none;
    color: #007BFF;
    }

    a:hover {
    text-decoration: underline;
    }
    </style>
