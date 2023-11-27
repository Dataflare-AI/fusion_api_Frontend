<template>
    <div class="page-container">
        <div class="custom-card">
            <h2 class="card-title">Enviar Arquivos</h2>
            <div class="drop-container" @dragover.prevent @drop="handleDrop" @dragenter="handleDragEnter"
                @dragleave="handleDragLeave">
                <div class="file-container">
                    <span class="drop-title">Solte o arquivo aqui<br />ou<br /> </span>
                    <label class="file-label" @dragover.prevent @drop="handleDrop">
                        {{ fileSelected ? fileName : 'Selecionar arquivo .xlsx' }}
                        <input class="file-input" type="file" @change="handleFileChange" accept=".xlsx" />
                    </label>
                    <progress v-if="isLoading" class="file-progress" max="100" :value="uploadProgress"></progress>
                </div>
            </div>
            <button class="send-button" :disabled="!fileSelected" @click="sendToApi">
                Enviar
            </button>
            <p class="error-message" v-if="fileError">Por favor, selecione um arquivo .xlsx válido.</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const isLoading = ref(false);
const fileSelected = ref(false);
const fileError = ref(false);
const fileName = ref('');
const uploadProgress = ref(0);

const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.name.toLowerCase().endsWith('.xlsx')) {
        fileSelected.value = true;
        fileName.value = file.name;
        fileError.value = false;
    } else {
        fileSelected.value = false;
        fileName.value = '';
        fileError.value = true;
    }
};

const handleDrop = (event) => {
    handleFileChange({ target: { files: event.dataTransfer.files } });
};

const handleDragEnter = () => {
    document.querySelector('.drop-container').classList.add('drag-active');
};

const handleDragLeave = () => {
    document.querySelector('.drop-container').classList.remove('drag-active');
};

const sendToApi = async () => {
    if (!fileSelected.value) {
        fileError.value = true;
        return;
    }

    isLoading.value = true;
    uploadProgress.value = 0;

    const formData = new FormData();
    formData.append('file', document.querySelector('.file-input').files[0]);

    try {
        const response = await axios.post(
            'http://127.0.0.1:8000/api/excel-import/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    uploadProgress.value = Math.round((progressEvent.loaded * 10) / progressEvent.total);
                },
            }
        );

        if (response.data.status === 'success') {
            console.log('Arquivo importado com sucesso:', response.data.data);
        } else {
            console.error('Erro ao importar o arquivo:', response.data.error);
        }

        setTimeout(() => {
            isLoading.value = false;
            uploadProgress.value = 0;
        }, 2000);
    } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
        isLoading.value = false;
        uploadProgress.value = 0;
    }
};
</script>

<style scoped>
.page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.custom-card {
    max-width: 90%;
    /* Tamanho responsivo, ajuste conforme necessário */
    padding: 20px;
    border: 2px solid #212529;
    border-radius: 5px;
    background-color: #fff;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
}

.custom-card:hover {
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.card-title {
    font-size: 2em;
    margin-bottom: 20px;
    color: #212529;
}

.file-container {
    margin-bottom: 20px;
}

.file-label {
    cursor: pointer;
    padding: 15px;
    border: 2px solid #212529;
    border-radius: 5px;
    display: inline-block;
    transition: background-color 0.3s, color 0.3s;
}

.file-label:hover {
    background-color: #212529;
    color: #fff;
}

.file-input {
    display: none;
}

.file-progress {
    width: 100%;
    margin-top: 15px;
    border-radius: 1px;
}

.drop-container {
    position: relative;
    display: flex;
    gap: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 150px;
    padding: 20px;
    border-radius: 10px;
    border: 2px dashed #555;
    color: #444;
    cursor: pointer;
    transition: background .2s ease-in-out, border .2s ease-in-out;
}

.drop-container:hover {
    background: #eee;
    border-color: #111;
}

.drop-container:hover .drop-title {
    color: #222;
}

.drop-title {
    color: #444;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    transition: color .2s ease-in-out;
}

.send-button {
    cursor: pointer;
    padding: 15px 30px;
    font-size: 1.3em;
    background-color: #212529;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    transition: background-color 0.3s;
}

.send-button:disabled {
    background-color: #555;
    cursor: not-allowed;
}

.send-button:hover {
    background-color: #000;
}

.error-message {
    color: #ff3333;
    margin-top: 15px;
    transition: opacity 0.3s;
    opacity: 0;
}

.error-message.visible {
    opacity: 1;
}

.drop-container.drag-active {
    background: #eee;
    border-color: #111;
}

.drop-container.drag-active .drop-title {
    color: #222;
}
</style>
