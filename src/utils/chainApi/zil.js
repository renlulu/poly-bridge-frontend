import { toStandardHex } from '@/utils/convertors';
import { validation } from '@zilliqa-js/util';
 

function addressToHash(address) {
    return toStandardHex(address);
  }
  
  function addressToHex(address) {
    return addressToHash(address);
  }

  function isValidAddress(address) {
    return validation.isAddress(address);
  }
  
  export default {
    install() {},
    addressToHash,
    addressToHex,
    isValidAddress,
  };