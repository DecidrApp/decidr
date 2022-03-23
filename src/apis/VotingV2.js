const irv = ballots => {
  const candidates = [...new Set(ballots.flat())];
  const votes = Object.entries(
    ballots.reduce((vL, [v]) => {
      vL[v] += 1;
      return vL;
    }, Object.assign(...candidates.map(c => ({[c]: 0})))),
  );
  const [topCand, topCount] = votes.reduce(
    ([n, m], [v, c]) => (c > m ? [v, c] : [n, m]),
    ['?', -Infinity],
  );
  const [bottomCand, bottomCount] = votes.reduce(
    ([n, m], [v, c]) => (c < m ? [v, c] : [n, m]),
    ['?', Infinity],
  );

  return topCount > ballots.length / 2
    ? topCand
    : irv(
        ballots
          .map(ballot => ballot.filter(c => c !== bottomCand))
          .filter(b => b.length > 0),
      );
};

function calculateRanking(options, ballots) {
  let allBallots = [];
  for (const ballot of ballots) {
    // Map object ballot from AppSync into format for IRV function
    const sorted = ballot
      .sort((a, b) => (a.rank > b.rank ? 1 : b.rank > a.rank ? -1 : 0))
      .map(a => a.name);

    allBallots.push(sorted);
  }
  return irv(allBallots);
}

export {calculateRanking};