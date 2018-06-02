import { ipcRenderer } from 'electron';
import db from './db';
import systemModel from './models/system';
import configModel from './models/config';
import migrator from './migrator';
import migrations from './seeders';
import api from './api';

const setup = async () => {

    try {
        await Promise.all([
            systemModel,
            configModel
        ].map(model => model.sync()));

        await db.authenticate();
        const alreadySeeded = await api.system.isAlreadySeeded();

        if (!alreadySeeded) {

            await migrator({ migrations }).up();
        }
        
        ipcRenderer.send('dbInitialized');
    } catch(err) {
        ipcRenderer.send('dbError', err);
    }
};

const stop = async () => {

    try {
        await db.close();
        ipcRenderer.send('dbStopped');
    } catch(err) {
        ipcRenderer.send('dbError', err);
    }
};

ipcRenderer.on('dbStart', () => setup());
ipcRenderer.on('dbStop', () => stop());

ipcRenderer.send('dbWorkerReadyForStart');

// Only for devs purposes
// @fixme Should be removed even on alpha
window.db = {
    api,
    db,
    ipcRenderer
};
