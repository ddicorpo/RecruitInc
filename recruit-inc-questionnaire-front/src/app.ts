require('dotenv').config();

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import expHbs from 'express-handlebars';
import path from 'path';

import { HttpStatus } from './http/http-status.enum';

// routes
import { HomeRoute } from './routes/home';
import { QuestionnaireRoute } from './routes/questionnaire';
import { FinishedRoute } from './routes/finished';

const PORT = process.env.PORT || 3000;

const app = express();

app.set('views', 'src/views');

app.engine('handlebars', expHbs({
    defaultLayout: 'main',
    layoutsDir: 'src/views/layouts',
    partialsDir: 'src/views/partials',
}));
app.set('view engine', 'handlebars');

app.use('/', express.static(path.join(__dirname, './views')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

HomeRoute.routes(app);
QuestionnaireRoute.routes(app);
FinishedRoute.routes(app);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});