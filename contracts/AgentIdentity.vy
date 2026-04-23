# @version 0.3.10

event AgentRegistered:
    agentId: indexed(bytes32)
    owner: indexed(address)
    metadataUri: String[256]

event ReputationUpdated:
    agentId: indexed(bytes32)
    newScore: uint256
    totalRatings: uint256

struct AgentProfile:
    owner: address
    metadataUri: String[256]
    reputationScore: uint256
    totalRatings: uint256
    isActive: bool
    registeredAt: uint256

agents: public(HashMap[bytes32, AgentProfile])
ownerToAgentId: public(HashMap[address, bytes32])
authorizedRaters: public(HashMap[address, bool])
owner: public(address)

@external
def __init__():
    self.owner = msg.sender
    self.authorizedRaters[msg.sender] = True

@internal
def _onlyOwner():
    assert msg.sender == self.owner, "Not owner"

@internal
def _onlyRater():
    assert self.authorizedRaters[msg.sender], "Not authorized rater"

@external
def registerAgent(metadataUri: String[256]) -> bytes32:
    agentId: bytes32 = keccak256(
        concat(convert(msg.sender, bytes32), convert(block.timestamp, bytes32))
    )
    assert not self.agents[agentId].isActive, "Agent already registered"

    self.agents[agentId] = AgentProfile({
        owner: msg.sender,
        metadataUri: metadataUri,
        reputationScore: 8000,
        totalRatings: 0,
        isActive: True,
        registeredAt: block.timestamp,
    })
    self.ownerToAgentId[msg.sender] = agentId

    log AgentRegistered(agentId, msg.sender, metadataUri)
    return agentId

@external
def updateReputation(agentId: bytes32, rating: uint256):
    self._onlyRater()
    assert self.agents[agentId].isActive, "Agent not found"
    assert rating <= 10000, "Rating out of range"

    current: uint256 = self.agents[agentId].reputationScore
    newScore: uint256 = (current * 9 + rating) / 10

    self.agents[agentId].reputationScore = newScore
    self.agents[agentId].totalRatings += 1

    log ReputationUpdated(agentId, newScore, self.agents[agentId].totalRatings)

@external
@view
def getAgentReputation(agentId: bytes32) -> (uint256, uint256):
    profile: AgentProfile = self.agents[agentId]
    return profile.reputationScore, profile.totalRatings

@external
def addAuthorizedRater(rater: address):
    self._onlyOwner()
    self.authorizedRaters[rater] = True
