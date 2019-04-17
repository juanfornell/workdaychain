var Company = artifacts.require('./Company.sol')

contract('Company', function (accounts) {

    //Comprobamos que la empresa se crea correctamente
    it('La empresa se crea correctamente', function () {
        var company
        var _companyName = 'Name'

        //Creamos una empresa para validar que se crea correctamente
        return Company.deployed().then(function (instance) {
            company = instance
            company.createCompany(_companyName, { from: accounts[0] })
            return company.getCompanyName.call(accounts[0], { from: accounts[0] })
        }).then(function (name) {
            //Validamos que el nombre de la empresa es el correcto
          assert.equal(name.valueOf(), _companyName, "el nombre de la empresa no es el esperado")
        })
    })

    //Se asigna el address correcto a la empresa
    it('El address de la empresa se asigna correctamente', function () {
        var company
        var _companyName = 'Name'

        //Creamos una empresa para validar que su address se asigna correctamente
        return Company.deployed().then(function (instance) {
            company = instance
            company.createCompany(_companyName, { from: accounts[0] })
            return company.getCompanyAddress.call(accounts[0], { from: accounts[0] })
        }).then(function (_address) {
            //Validamos que el address de la empresa es el correcto
          assert.equal(_address.valueOf(), accounts[0], "el address de la empresa no es el esperado")
        })
    })

    //Se crea un empleado
    it('El trabajador se crea correctamente', function () {
        var company
        var _workerAddress = accounts[1]
        var _workerId = '1'

        //Creamos un nuevo trabajador
        return Company.deployed().then(function (instance) {
            company = instance
            company.addWorker(_workerAddress, _workerId, { from: accounts[0] })
            return company.getWorkerId.call(_workerAddress, { from: accounts[0] })
        }).then(function (_id) {
            //Validamos que el id del trabajador para el address creado es correcto
          assert.equal(_id.valueOf(), _workerId , "el trabajador no se ha creado correctamente")
        })
    })

    //Se introducen Tracks
    it('Los Tracks se crean correctamente', function () {
        var company
        var _day = '01/01/2001'
        var _category = 'Entrada'
        var _observation = 'Entrada'
        var _location = 'Entrada'
        var _state = false
        var _id = 0

        //Creamos un nuevo track desde l address del trabajador
        return Company.deployed().then(function (instance) {
            company = instance
            company.addTrack(_day, _category, _observation, _location, { from: accounts[1] })
            return company.getTrack.call(accounts[1], _id, { from: accounts[0] })
        }).then(function (value) {
            //Validamos que los datos introducidos son los esperados
            assert.equal(value[0].valueOf(), _day, "el dia no se ha creado correctamente")
            assert.equal(value[1].valueOf(), _category, "la categoria no se ha creado correctamente")
            assert.equal(value[2].valueOf(), _observation, "las observaciones no se han creado correctamente")
            assert.equal(value[3].valueOf(), _location, "el lugar no se ha creado correctamente")
            assert.equal(value[4].valueOf(), _state, "el estado no se ha creado correctamente")
        })
    })


    //Se valida correctamente
    it('La validación se realiza correctamente', function () {
        var company
        var _workerAddress = accounts[1]
        var _id = 0

        //Validamos el track del empleado desde el address de la empresa
        return Company.deployed().then(function (instance) {
            company = instance
            company.validate(_workerAddress, _id, { from: accounts[0] })
            return company.getTrack.call(_workerAddress, _id, { from: accounts[0] })
        }).then(function (value) {
            //Comprobamos que la validación se ha realizado
            assert.equal(value[4].valueOf(), true, "la validación no era la esperada")
        })
    })
})
