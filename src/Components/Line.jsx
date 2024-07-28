export function Line({ guess, isFinal, solution, shakeIndex, index }) {
    const boxes = [];
  
    for (let i = 0; i < 5; i++) {
      const char = guess[i] || '';
      let className = 'box';
  
      if (isFinal) {
        if (char === solution[i]) {
          className += ' correct';
        } else if (solution.includes(char)) {
          className += ' close';
        } else {
          className += ' incorrect';
        }
      }
  
      boxes.push(
        <div key={i} className={className}>
          {char}
        </div>
      );
    }
  
    return (
      <div className={`line ${index === shakeIndex ? 'shake' : ''}`}>
        {boxes}
      </div>
    );
  }