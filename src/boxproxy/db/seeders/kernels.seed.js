export default {
    name: 'kernels',

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('kernels', {});
    }
};
