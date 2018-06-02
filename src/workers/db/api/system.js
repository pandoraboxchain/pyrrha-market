import System from '../models/system';

export const getAll = async () => {
    return await System.findAll();
};

export const isAlreadySeeded = async () => {
    const alreadySeeded = await System.findOne({
        where: {
            name: 'alreadySeeded',
            value: 'yes'
        }
    });

    return !!alreadySeeded;
};
