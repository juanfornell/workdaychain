pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract CompanyOwned {

    string name;
    address companyAddress;

    event logCompanyCreated(string description, address _addressCompany);

    function createCompany (string memory _name) public {
        
        name = _name;
        companyAddress = msg.sender;

        emit logCompanyCreated("Company created at: ", companyAddress);
    }

    function getCompanyAddress () public view returns (address) {
        
        return companyAddress;
    }

    function getCompanyName () public view returns (string memory) {
        
        return name;
    }

    function existsCompany () public view returns (bool) {

        if (companyAddress == address(0)) {
            return false;
        } 
        else return true;
    }

    modifier onlyCompany () {
    require(msg.sender == companyAddress);
    _;
    }
}

contract Company is CompanyOwned {
    
    using SafeMath for uint;

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
        
        string date;
        string category;
        string observations;
        string location;
        bool validated;
    }

    event logWorkerAdded(string description, address _workerAddress);
    event logTrackAdded(string description, address _workerAddress, string _day);
    event logValidated(string description, address _workerAddress, uint _track);

    function isWorker (address _address) public view returns (bool) {

        return MapAddressWorkers[_address];
    }
    
    function addWorker(address _worker, string memory _workerId) public onlyCompany {
        
        require(isWorker(_worker) != true);
        
        Worker storage newWorker = MapWorkers[_worker];
        
        newWorker.workerId = _workerId;
        newWorker.lenghtTracks = 0;

        MapAddressWorkers[_worker] = true;
        IterateWorkers[numberWorkers] = _worker;
        numberWorkers = numberWorkers.add(1);

        emit logWorkerAdded("Worker added at: ", _worker);
    }
    
    function addTrack(  
        string memory _date, 
        string memory _category,
        string memory _observations,
        string memory _location) public
    {
        require(isWorker(msg.sender));

        MapWorkers[msg.sender].tracks.push(Track(_date, _category, _observations, _location, false));
        MapWorkers[msg.sender].lenghtTracks++;

        emit logTrackAdded("Track added for worker: ", msg.sender, _date);
    }
    
    function getTrack (address _workerAddress, uint _id) public view returns(
        string memory,
        string memory,
        string memory,
        string memory,
        bool) {
        
        string memory _date = MapWorkers[_workerAddress].tracks[_id].date;
        string memory _category = MapWorkers[_workerAddress].tracks[_id].category;
        string memory _observations = MapWorkers[_workerAddress].tracks[_id].observations;
        string memory _location = MapWorkers[_workerAddress].tracks[_id].location;
        bool _validated = MapWorkers[_workerAddress].tracks[_id].validated;
        
        return(_date, _category, _observations, _location, _validated);
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
    
    function validate (address _workerAddress, uint _id) public onlyCompany {
        
        require(companyAddress == msg.sender);
        MapWorkers[_workerAddress].tracks[_id].validated = true;

        emit logValidated("Track validated for worker: ", _workerAddress, _id);
    } 
}