import { integerToDecimal } from './convertors';

export function mapTransactionToDo(data) {
  const { name, precision } = data.token.tokenBasic;
  const amount = integerToDecimal(data.amount, precision);
  const time = data.time * 1000;
  const fromTransactionHash = data.steps[0] && data.steps[0].hash;
  const toTransactionHash = data.steps[2] && data.steps[2].hash;
  const steps = data.steps.map(step => (step.hash ? step : { chainId: step.chainId }));

  return {
    ...data,
    amount,
    time,
    tokenBasicName: name,
    fromTransactionHash,
    toTransactionHash,
    steps,
  };
}
