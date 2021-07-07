const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const cors = require('cors');

const PORT = 3001;

// proxy 를 사용하는 것보다 cors 라이브러리를 사용하는 것이 훨씬 빠르다!
// 직접 비교해본 결과, proxy 를 사용하면 두 번에 한번꼴로 서버와 통신시 딜레이가 살짝 있다.
app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true
}));
app.use('/', indexRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`Server run : http://localhost:${PORT}`);
});

