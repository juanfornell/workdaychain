pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract A {

    string name;
    address companyAddress;

    function createCompany (string memory _name) public {
        
        name = _name;
        companyAddress = msg.sender;
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

    modifier onlyCompany () {
    require(msg.sender == companyAddress);
    _;
    }
}

contract Company is A {
    
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
        
        uint date;
        string category;
        string observations;
        string location;
        bool validated;
    }

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
    } 
}