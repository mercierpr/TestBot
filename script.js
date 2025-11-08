const { createApp, ref } = Vue

const app = {
    data() {
        return {
            answersToBtn: [],
            messages: ref([]),
            emptyChat: true,
            botMsg: '',
            typeChat: true,
            file: 'assets/question-web.json',
        }
    },
    methods: {
        addNewMsg() {
            this.emptyChat = false;
            this.messages.push({from: 'user', text: this.userInput});
            fetch(this.file)
            .then(res => res.json())
            .then(data => {
                this.findAllQuery(data);
            });
        },
        findAllQuery(data){
            const answers = [];
            this.botMsg = '';
            
            const queryWord = this.userInput
            .toLowerCase()
            .replace(/[.,!?]/g,'')
            .split(' ');

            data.forEach(answer => {
                for (let word of queryWord){
                    if(answer.words.includes(word)) {
                        answers.push(answer.question);
                        break;
                    }
                }
            });
            this.answersToBtn = answers;
            this.botMsg = (answers.length) ? 'Вот что могу предложить:' : 'Совпадений не найдено :(';
            this.messages.push({from: 'bot', text: this.botMsg});
        },
        findAnswers(){
            this.messages.push({from: 'user', text: this.userInput});
            fetch(this.file)
            .then(res => res.json())
            .then(data => {
                data.forEach(answer => {
                    if(answer.question.includes(this.userInput)){
                        this.botMsg = answer.answer;                     
                    }
                });
                this.messages.push({from: 'bot', text: this.botMsg});
            });
        },
        newQuery(btnMsg){
            this.userInput = btnMsg;
            this.findAnswers();
        },
        clearChat(){
            this.typeChat = !this.typeChat;
            this.answersToBtn = [];
            this.messages = ref([]);
            this.emptyChat = true;
            this.botMsg = '';
            this.file = this.typeChat == true ? 'assets/question-web.json' : 'assets/question-typography.json';
        },
    },
}

Vue.createApp(app).mount("#app");

