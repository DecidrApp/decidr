const {Schulze, RankedPair} = require('condorcet');

function calculateRanking(options, ballots) {
  // Create candidates set
  const candidates = new Set(options);
  const s = new Schulze(candidates);

  for (const ballot of ballots) {
    // Map object ballot from AppSync into format for condorcet library
    s.addBallot(new Map(ballot.map(a => [a.name, a.rank])));
  }

  // Return ranking
  return s.rank();
}

export {calculateRanking};
