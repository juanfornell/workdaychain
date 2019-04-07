pragma solidity ^0.5.0;

contract Company {
        
    string name;
    address companyAddress;
    uint numberWorkers;
    mapping(address => Worker) MapWorkers;
    mapping(uint => address) IterateWorkers;
    mapping(address => bool) MapAddressWorkers;
    
    struct Worker {
        
        string workerId;
        Track[] tracks;
        uint lenghtTracks;
    }
    
    struct Track {
        
        uint date;
        string category;
        string observations;
        string location;
        bool validated;
    }
    
    function createCompany (string memory _name) public {
        
        name = _name;
        companyAddress = msg.sender;
        numberWorkers = 0;
    }

    function getCompanyAddress () public view returns (address) {
        return companyAddress;
    }

    function existsCompany () public view returns (bool) {

        if (companyAddress == address(0)) {
            return false;
        } 
        else return true;
    }

    function isWorker (address _address) public view returns (bool) {

        return MapAddressWorkers[_address];
    }
    
    function addWorker(address _worker, string memory _workerId) public {
        
        //Comprobar antes que no esté en otra empresa
        
        Worker storage newWorker = MapWorkers[_worker];
        
        newWorker.workerId = _workerId;
        newWorker.lenghtTracks = 0;

        MapAddressWorkers[_worker] = true;
        IterateWorkers[numberWorkers] = _worker;
        numberWorkers++;
    }
    
    function addTrack(  
        uint _date, 
        string memory _category,
        string memory _observations,
        string memory _location) public
    {
        MapWorkers[msg.sender].tracks.push(Track(_date, _category, _observations, _location, false));
        MapWorkers[msg.sender].lenghtTracks++;
    }
    
    function getTrack (address _workerAddress, uint _id) public view returns(
        uint,
        string memory,
        string memory,
        string memory,
        bool) {
        
        uint _date = MapWorkers[_workerAddress].tracks[_id].date;
        string memory _category = MapWorkers[_workerAddress].tracks[_id].category;
        string memory _observations = MapWorkers[_workerAddress].tracks[_id].observations;
        string memory _location = MapWorkers[_workerAddress].tracks[_id].location;
        bool _validated = MapWorkers[_workerAddress].tracks[_id].validated;
        
        return(_date, _category, _observations, _location, _validated);
    }

    function getTrackDate (address _workerAddress, uint _id) public view returns(uint) {
        
        return MapWorkers[_workerAddress].tracks[_id].date;
    }

    function getTrackCategory (address _workerAddress, uint _id) public view returns(string memory) {
        
        return MapWorkers[_workerAddress].tracks[_id].category;
    }

    function getTrackObservations (address _workerAddress, uint _id) public view returns(string memory) {
        
        return MapWorkers[_workerAddress].tracks[_id].observations;
    }

    function getTrackLocation (address _workerAddress, uint _id) public view returns(string memory) {
        
        return MapWorkers[_workerAddress].tracks[_id].location;
    }

    function getTrackValidation (address _workerAddress, uint _id) public view returns(bool) {
        
        return MapWorkers[_workerAddress].tracks[_id].validated;
    }

    function getNumberTracks (address _workerAddress) public view returns (uint) {

        return MapWorkers[_workerAddress].lenghtTracks;
    }

    function getNumberWorkers () public view returns (uint) {

        return numberWorkers;
    }

    function getWorker (uint i) public view returns (address) {

        return IterateWorkers[i];
    }

    function getWorkerId (address _workerAddress) public view returns (string memory) {

        return MapWorkers[_workerAddress].workerId;
    }
    
    function validate (address _workerAddress, uint _id) public {
        
        require(companyAddress == msg.sender);
        MapWorkers[_workerAddress].tracks[_id].validated = true;
    } 
}