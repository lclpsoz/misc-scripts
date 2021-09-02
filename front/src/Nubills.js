import { useEffect, useState } from 'react';
import axios from 'axios';

import './Nubills.css';

function getCardExpense({title, category, date, amount}) {
  return (  
    <div className='expense'>
      <table>
        <tbody>
          <tr height='25%'>
            <td width='20%' id='left-corner-elem'>{date}</td>
            <td><b>{category}</b></td>
            <td width='20%' id='right-corner-elem'>R$ {(amount / 100).toFixed(2)}</td>
          </tr>
          <tr>
            <td id='title' colSpan='3'>{title}</td>
          </tr>
          <tr height='25%'></tr>
        </tbody>
      </table>
    </div>
  );
}

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
    <div className='Nubills'>
      {matches ?
        <div className='matches'>
          <h1>Matches</h1>
          <table id='matches'>
            <thead> 
              <tr>
                <th>Mobills</th>
                <th>NuBank</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(matches).slice(1).map((item, idx) => (
                <tr key={idx}>
                  <td id='matches'>{getCardExpense(matches[item]['mobills'])}</td>
                  <td id='matches'>{getCardExpense(matches[item]['nubank'])}</td>
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
