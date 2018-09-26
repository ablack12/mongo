/*
 * SERVER-33883: Tests that a mongos started with --ipv6 fallsbacks to IPv4 on failure.
 */

(function() {
    "use strict";
    var assertStartupSucceeds = function(conn) {
        assert.commandWorked(conn.adminCommand({ismaster: 1}), "CONNECTION FAILED");
    };

    const dbPath = "fallback_resolve";
    const bindIP = "localhost";

    function runTest(st) {
        let configdb = st.configRS.getURL();
        print("configdb is " + configdb);
        // var mongos = MongoRunner.runMongos({configdb: configdb, ipv6: ""});
        // assertStartupSucceeds(mongos);
        // MongoRunner.stopMongos(mongos);

        let returnCode =
            runMongoProgram("mongo", "--port", "" + st._mongos[0].port, "--eval", ";", "--ipv6");
        print("START UP DONE!!!");
        assert.eq(returnCode, 0, "expected mongos to start successfully with --ipv6");
    }

    const st = new ShardingTest(
        {config: 1, mongos: 1, shards: 1, oplogsize: 100, other: {useHostname: true}});

    runTest(st);
    st.stop();

})();
