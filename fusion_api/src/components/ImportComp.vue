<template>
    <div class="import-container">
        <div class="center-content">
            <label for="formFileLg" class="form-label">Selecione um arquivo .xlsx</label>
            <div class="file-input-container">
                <label class="upload-button">
                    <font-awesome-icon icon="file-import" class="fa-file-import" />
                    <input class="form-control" type="file" id="formFile" @change="handleFileChange" accept=".xlsx" />
                </label>
                <button class="send-button" :disabled="!fileSelected" @click="sendToUrl">
                    Padronizar
                </button>
            </div>
            <p class="error-message" v-if="fileError">Por favor, selecione um arquivo .xlsx válido.</p>
            <loading :active="isLoading" :can-cancel="false"></loading>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoading } from 'vue-loading-overlay';

const isLoading = ref(false);
const fileSelected = ref(false);
const fileError = ref(false);

const importFile = async () => {
    isLoading.value = true;

    try {
        const response = await fetch('http://localhost:3000/import_data_to_excel/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: 'conteúdo do arquivo aqui' }),
        });

        console.log('Resposta do servidor:', response);

        setTimeout(() => {
            isLoading.value = false;
        }, 2000);
    } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
        isLoading.value = false;
    }
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Arquivo alterado:', file);

    if (file && file.name.toLowerCase().endsWith('.xlsx')) {
        fileSelected.value = true;
        fileError.value = false; // Limpar mensagem de erro se um arquivo válido for selecionado
    } else {
        fileSelected.value = false;
        fileError.value = true; // Exibir mensagem de erro se o arquivo for inválido
    }
};

const sendToUrl = () => {
    console.log('Padronizado e enviado para a URL!');
    if (!fileSelected.value) {
        fileError.value = true; // Exibir mensagem de erro se o usuário tentar enviar sem um arquivo válido
        return;
    }

    importFile();
};
</script>

<style scoped>
.import-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #ffffff;
    /* Cor de fundo escura */
    color: #ffffff;
    /* Cor do texto clara */
}

.center-content {
    text-align: center;
}

.form-label {
    color: #000000;
    /* Cor do texto da label */
}

.form-control {
    background-color: #444;
    /* Cor de fundo do input */
    color: #ffffff;
    /* Cor do texto do input */
    border: 1px solid #777;
    /* Cor da borda do input */
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
    /* Cor da borda do botão de upload */
    border-radius: 5px;
    margin-right: 10px;
}

.upload-button:hover {
    background-color: #555;
    /* Cor de fundo ao passar o mouse sobre o botão de upload */
    color: #ffffff;
    /* Cor do texto ao passar o mouse sobre o botão de upload */
}

.send-button {
    cursor: pointer;
    padding: 10px 20px;
    background-color: #777;
    /* Cor de fundo do botão de envio */
    color: #ffffff;
    /* Cor do texto do botão de envio */
    border: none;
    border-radius: 5px;
}

.send-button:hover {
    background-color: #555;
    /* Cor de fundo ao passar o mouse sobre o botão de envio */
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
    /* Cor vermelha para mensagens de erro */
    margin-top: 10px;
}
</style>