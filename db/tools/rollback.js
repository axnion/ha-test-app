
execute(getClient(), "SELECT * FROM version WHERE table_name='item' ALLOW FILTERING")
.then(function(resuluts) {
    id = results.rows[0].id
    pre_version = results.rows[0].pre_version

    return executeRisky(getClient(), "UPDATE version SET cur_version = " + pre_version + " WHERE id = " + id )    
})
