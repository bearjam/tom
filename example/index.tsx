import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import { CSlider, USlider } from '../src/';

const initValue = 50;

const App = () => {
  const [value, setValue] = React.useState(initValue);
  const [value2, setValue2] = React.useState(initValue);

  return (
    <div>
      <div>
        <CSlider
          name="someSlider"
          value={value}
          set={v => setValue(parseInt(v))}
          step={1}
          min={0}
          max={100}
        />
        {value}
        <button onClick={() => void setValue(75)}>Set value 75</button>
      </div>
      <div>
        <USlider
          name="anotherSlider"
          defaultValue={value2}
          set={v => setValue2(parseInt(v))}
          step={1}
          min={0}
          max={100}
        />
        {value2}
        <button onClick={() => void setValue2(25)}>Set value 25</button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
