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
                    <!-- Visualização dos dados da tabela -->
                    <div v-if="tableData">
                        <h4>Dados da Tabela</h4>
                        <pre>{{ tableData }}</pre>
                    </div>
                    <!-- Campo para exibir as colunas da tabela -->
                    <div v-if="tableColumns">
                        <h4>Colunas da Tabela</h4>
                        <ul>
                            <li v-for="column in tableColumns" :key="column">{{ column }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            fileList: [],
            selectedFile: '',
            tableData: null,
            showAllFiles: false,
            filesToShowInitially: 5,
            tableColumns: null,
            loadingTable: false, // Adicionamos uma variável para rastrear o carregamento da tabela
            tableError: null, // Adicionamos uma variável para armazenar mensagens de erro
        };
    },
    computed: {
        limitedFileList() {
            return this.fileList.slice(0, this.filesToShowInitially);
        },
    },
    watch: {
        // Atualizar dados da tabela quando a tabela selecionada mudar
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
                const response = await axios.get('http://127.0.0.1:8000/api/excel-import/');
                this.fileList = response.data.map((fileInfo) => ({
                    file: fileInfo.file,
                    fileName: fileInfo.file.split('/').pop(),
                }));
            } catch (error) {
                console.error('Erro ao buscar a lista de arquivos:', error);
            }
        },
        async loadTable() {
            if (this.selectedFile) {
                try {
                    // Corrigir a formatação da URL removendo o caractere ':' extra
                    const url = this.selectedFile.file.replace(':19003', '');

                    console.log('Antes da solicitação, URL da tabela selecionada:', url);

                    const response = await axios.get(url);
                    console.log('Resposta da solicitação:', response);

                    this.tableData = response.data;
                } catch (error) {
                    console.error('Erro ao carregar dados da tabela:', error.message);
                }
            } else {
                this.tableData = null;
            }
        }
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
