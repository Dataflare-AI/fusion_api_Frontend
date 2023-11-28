<template>
  <div id="app">
    <div class="card">
      <div id="chooseTable">
        <h2>Escolher Tabela</h2>
        <select v-model="selectedFile" @change="loadTable">
          <option value="">Escolha uma tabela</option>
          <option v-for="fileInfo in limitedFileList" :value="fileInfo.id" :key="fileInfo.id">
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
import axios from 'axios'

export default {
  data() {
    return {
      fileList: [],
      selectedFile: undefined, // Alterado de null para undefined
      tableData: null,
      showAllFiles: false,
      filesToShowInitially: 5
    }
  },
  computed: {
    limitedFileList() {
      return this.fileList.slice(0, this.filesToShowInitially)
    }
  },
  watch: {
    selectedFile: {
      handler(newFile, oldFile) {
        console.log('Watcher acionado! Novo valor de selectedFile:', newFile)
        console.log('Valor antigo de selectedFile:', oldFile)

        // Verifique se o novo arquivo é definido antes de chamar loadTable
        if (newFile !== undefined) {
          this.loadTable()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchFileList()
  },
  methods: {
    async loadTable() {
      try {
        console.log('Caminho do arquivo selecionado (antes):', this.selectedFile)

        if (this.selectedFile && this.selectedFile.file) {
          const filePath = this.selectedFile.file.startsWith('/')
            ? this.selectedFile.file.substring(1)
            : this.selectedFile.file
          const url = `http://127.0.0.1:8000${filePath}`

          console.log('URL da requisição:', url)

          const response = await axios.get(url)
          console.log('Resposta da requisição:', response.data)

          this.tableData = response.data // Atualize conforme necessário
        } else {
          console.error('Caminho do arquivo indefinido ou inválido:', this.selectedFile)
        }
      } catch (error) {
        console.error('Erro ao carregar dados da tabela', error)
      }
    },
    async fetchFileList() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/excel-import/')
        this.fileList = Array.isArray(response.data.files) ? response.data.files : []
      } catch (error) {
        console.error('Erro ao buscar a lista de arquivos.', error)
      }
    }
  }
}
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
  color: #007bff;
}

a:hover {
  text-decoration: underline;
}
</style>
