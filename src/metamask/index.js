import path from 'path';
import fs from 'fs';
import request from 'request';
import unzip from 'cross-unzip';
import rimraf from 'rimraf';
import { app, BrowserWindow } from 'electron';
import log from '../logger';

const crxDownloadTo = (id, to) => {
    const url = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=49.0&x=id%3D${id}%26installsource%3Dondemand%26uc`;
    
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(to);
        writeStream
            .on('error', reject)
            .on('close', resolve);
        request(url).pipe(writeStream);
    });
}

const changePermissions = (dir, mode) => {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        fs.chmodSync(filePath, parseInt(mode, 8));

        if (fs.statSync(filePath).isDirectory()) {

            changePermissions(filePath, mode);
        }
    });
};

const downloadMetamask = async (rewrite = false) => {
    const metamaskId = 'nkbihfbeogaeaoehlefnkodbefgpgknn';
    const appDataDir = app.getPath('userData');
    const extensionsDir = path.resolve(appDataDir, 'extensions');
    const metamaskExtPath = path.resolve(extensionsDir, metamaskId);
    const metamaskCrxPath = path.resolve(extensionsDir, `${metamaskId}.crx`);

    if (!fs.existsSync(extensionsDir)) {
        
        fs.mkdirSync(extensionsDir);
    }

    if (fs.existsSync(metamaskExtPath)) {

        if (rewrite) {

            await new Promise((resolve, reject) => {

                rimraf(metamaskExtPath, err => {

                    if (err) {

                        return reject(err);
                    }

                    resolve();
                });
            });
        } else {

            return metamaskExtPath;
        }
    }

    await crxDownloadTo(metamaskId, metamaskCrxPath);

    await new Promise((resolve, reject) => {

        unzip(metamaskCrxPath, metamaskExtPath, (err) => {

            if (err && !fs.existsSync(path.resolve(metamaskExtPath, 'manifest.json'))) {
                
                return reject(err);
            }

            changePermissions(metamaskExtPath, 755);
            resolve();
        });
    });
        
    return metamaskExtPath;
};

export default async (session, rewrite) => {
    const metamaskPath = await downloadMetamask(rewrite);

    // await new Promise((resolve, reject) => {
    //     fs.readFile(path.resolve(metamaskPath, 'manifest.json'), 'utf8', (err, data) => {

    //         if (err) {

    //             return reject(err);
    //         }

    //         const manifest = JSON.parse(data);

    //         console.log('!!!>>>1:', session);
    //         console.log('!!!>>>2:', session.defaultSession);

    //         session.defaultSession.extensions.load(metamaskPath, manifest, 'component');
    //     });
    // });
    const extName = BrowserWindow.addExtension(metamaskPath);
    console.log('!!!>>>', extName)
};
