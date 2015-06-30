// prelude-js version 0, requires active web3 connection 
module.exports = (function(web3, pack, main_name, main_address) {
    var abi = pack[main_name]["json-abi"]
    var contract = web3.eth.contract(abi).at(main_address);

    var mod = {};
    var Promise = require("promise");
    var privkey = "";

    var opts = {
        gas:10000
    }
    _.each( contract, function(func, function_name) {
        var send = function() {
            return Promise.new(function(resolve, reject) {
                func.sendTransaction(opts, function(err, trx_id) {
                    if (err) { reject(err); }
                    else { resolve(trx_id); }
                });
            });
        }
        var call = function() {
             return Promise.new(function(resolve, reject) {
                func.call(opts, function(err, trx_id) {
                    if (err) { reject(err); }
                    else { resolve(trx_id); }
                });
            });
           
        }
        mod["call"+func_name] = call;
        mod["send_"+func_name] = send;
        mod["confirm_"+func_name] = send().then(function( res ) {
            web3.eth.filter('latest'); //TODO check for trx
        });
    });

    mod.use_priv_key = function(p) {
        privkey = p;
    }

    return mod;
});

// Example use
if( require.main === module ) {
    example_abi = [];
    var muse = module.exports(web3, pack, "PreludeRoot", "0x0");
    muse.use_priv_key( "" );
    muse.send_RequestArtistCoin("EDDIE").then(function(trx_id) {
        console.log( trx_id );
    }, function (err ) {
        console.log("There was an error.");
    }).done();
}
