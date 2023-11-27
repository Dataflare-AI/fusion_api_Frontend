<template>
    <div class="import-container">
        <div class="center-content">
            <label for="formFileLg" class="form-label">Selecione um arquivo .xlsx</label>
            <div class="file-input-container">
                <label class="upload-button">
                    <font-awesome-icon icon="file-import" class="fa-file-import" />
                    <input class="form-control" type="file" id="formFile" @change="handleFileChange" accept=".xlsx" />
                </label>
                <button class="send-button" :disabled="!fileSelected" @click="sendToApi">
                    Importar
                </button>
            </div>
            <p class="error-message" v-if="fileError">Por favor, selecione um arquivo .xlsx válido.</p>
            <loading :active="isLoading" :can-cancel="false"></loading>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
// import { useLoading } from 'vue-loading-overlay';
import axios from 'axios';

const isLoading = ref(false);
const fileSelected = ref(false);
const fileError = ref(false);

const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.name.toLowerCase().endsWith('.xlsx')) {
        fileSelected.value = true;
        fileError.value = false;
    } else {
        fileSelected.value = false;
        fileError.value = true;
    }
};

const sendToApi = async () => {
    if (!fileSelected.value) {
        fileError.value = true;
        return;
    }

    isLoading.value = true;

    const formData = new FormData();
    formData.append('file', document.getElementById('formFile').files[0]);

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/excel-import/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Verificar se a resposta contém a chave 'status' igual a 'success'
        if (response.data.status === 'success') {
            console.log('Arquivo importado com sucesso:', response.data.data);
            // Adicione aqui qualquer lógica adicional que você deseja executar em caso de sucesso
        } else {
            console.error('Erro ao importar o arquivo:', response.data.error);
            // Adicione aqui qualquer lógica adicional que você deseja executar em caso de erro
        }

        setTimeout(() => {
            isLoading.value = false;
        }, 2000);
    } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
        isLoading.value = false;
    }
};
</script>

<style scoped>
.import-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #ffffff;
    color: #000000;
}

.center-content {
    text-align: center;
}

.form-label {
    color: #000000;
}

.form-control {
    background-color: #444;
    color: #ffffff;
    border: 1px solid #777;
}

.file-input-container {
    display: flex;
    align-items: center;
}

.upload-button {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 10px;
    border: 2px solid #777;
    border-radius: 5px;
    margin-right: 10px;
}

.upload-button:hover {
    background-color: #555;
    color: #ffffff;
}

.send-button {
    cursor: pointer;
    padding: 10px 20px;
    background-color: #777;
    color: #ffffff;
    border: none;
    border-radius: 5px;
}

.send-button:hover {
    background-color: #555;
}

.fa-file-import {
    margin-right: 10px;
    color: #555;
}

.fa-file-import:hover {
    margin-right: 10px;
    color: #ffffff;
}

.error-message {
    color: #ff3333;
    margin-top: 10px;
}
</style>
    