import { useEffect, useState } from 'react';
import axios from 'axios';

import './Nubills.css';

function Nubills() {
  const [data, setData] = useState(undefined);
  const [matches, setMatches] = useState(undefined);

  useEffect(() => {
    document.title = 'Nubills';
    console.log('In useEffect!', process.env.REACT_APP_NODE);
    axios.get(process.env.REACT_APP_NODE, { params: { openMonth: '2021-07', mobillsFileName: '' } }).then((res) => {
      console.log(res.data);
      setData(res.data);
      setMatches(res.data.matches)
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div className="Nubills">
      {matches ?
        <div className='matches'>
          <h1>Matches</h1>
          <table>
            <thead> 
              <tr>
                <th>{matches[0][0]}</th>
                <th>{matches[0][1]}</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(matches).slice(1).map((item, idx) => (
                <tr key={idx}>
                  <td>{JSON.stringify(matches[item][0])}</td>
                  <td>{JSON.stringify(matches[item][1])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        :
        null}
    </div>
  );
}

export default Nubills;
