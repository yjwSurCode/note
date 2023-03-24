import { useControlledState } from '../hooks/use-advanced';

const UseControlledStateFN: FC = (_props) => {
  const onChangeHandle = (v: any) => {
    console.log('vvvv', v);
    setValue(v);
  };

  const [value, setValue] = useState(1);

  return (
    <div>
      <div
        onClick={() => {
          alert(1);
        }}
      >
        父组件---
      </div>
      <UseControlledStateF
        // value={value}
        defaultValue={111}
        // onChange={onChangeHandle}
      ></UseControlledStateF>
    </div>
  );
};
