const { queryEventsByType, getObjects, } = require('../helper/chain/sui')
const ADDRESSES = require('../helper/coreAssets.json')

async function tvl(api) {
  const eventType = '0xc4bb66da17fec7444b7b3e2ac750e35ea6225f5cca936c423fad2c78245d987c::suipump::Created'

  // Get all created tokens
  const events = await queryEventsByType({ eventType, transform: i => i.bonding_curve })
  
  // Get all bonding curve data
  const tokens = await getObjects(events)
  
  tokens.forEach(object => {

    // Get the real_sui_reserves from the object
    const amount = object.fields.real_sui_reserves

    // Add real_sui_reserves to the calculation
    api.add(ADDRESSES.sui.SUI, amount)
  })

}

module.exports = {
  timetravel: false,
  sui: {
      tvl,
  },
  methodology: "TVL is calculated from the total SUI locked in all suipump contract pools. The values are taken from the real_sui_reserves of each pool.",
};
