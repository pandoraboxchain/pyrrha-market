export default {
    name: 'datasets',

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('datasets', {});
    }
};
