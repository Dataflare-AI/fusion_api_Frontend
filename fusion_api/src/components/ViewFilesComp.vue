<template>
    <div id="app">
        <div class="card">
            <div id="chooseTable">
                <h2>Escolher Tabela</h2>
                <select v-model="selectedFile" @change="loadTable">
                    <option value="">Escolha uma tabela</option>
                    <option v-for="fileInfo in limitedFileList" :value="fileInfo" :key="fileInfo.file">
                        {{ fileInfo.fileName }}
                    </option>
                </select>
                <div v-if="selectedFile">
                    <h3>Tabela Selecionada: {{ selectedFile.fileName }}</h3>
                    <!-- Visualização dos dados da tabela -->
                    <div v-if="tableData">
                        <h4>Dados da Tabela</h4>
                        <pre>{{ tableData }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;

export default {
    data() {
        return {
            fileList: [],
            selectedFile: '',
            tableData: null,
            showAllFiles: false,
            filesToShowInitially: 5,
        };
    },
    computed: {
        limitedFileList() {
            return this.fileList.slice(0, this.filesToShowInitially);
        },
    },
    watch: {
        selectedFile: {
            handler() {
                this.loadTable();
            },
            immediate: true,
        },
    },
    mounted() {
        this.fetchFileList();
    },
    methods: {
        async fetchFileList() {
            try {
                const response = await axios.get('/api/excel-import/');
                this.fileList = response.data.map((fileInfo) => ({
                    file: `/media${fileInfo.file}`,  // Atualizado para incluir "/media"
                    fileName: fileInfo.file.split('/').pop(),
                }));
            } catch (error) {
                console.error('Erro ao buscar a lista de arquivos.', error);
            }
        },
        async loadTable() {
            try {
                const response = await axios.get(this.selectedFile.file);
                console.log(response.data);
                this.tableData = response.data; // Atualize conforme necessário
            } catch (error) {
                console.error('Erro ao carregar dados da tabela', error);
            }
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

#chooseTable {
    margin-bottom: 20px;
}

select {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
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
