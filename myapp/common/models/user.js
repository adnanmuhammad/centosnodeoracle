'use strict';

var app = require('../../server/server');
var lbctx = require('loopback-context');

module.exports = function(User) {

    var ds = app.dataSources.rjapp.adapter.driver;
    console.log(Object.keys(app.dataSources.rjapp.operations()));

    User.signup = function (user, cb) {
        var result;
        //        ds.getConnection
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                loginid: user.loginid,
                acname: { val: user.acname, dir: ds.BIND_IN },
                svsid: { val: user.svsid, dir: ds.BIND_IN },
                status: { type: ds.NUMBER, dir: ds.BIND_OUT },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                reset_key: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };


            var sql = "DECLARE rslt    zresult    := zresult();   usr     zUSER      := zUSER();  \
             BEGIN   \
                usr.login_id := :loginid;  \
                usr.email := :loginid;  \
                usr.usrname := :acname; \
                usr.svsid := :svsid; \
                usr.signup( rslt); \
                :reset_key := '';\
                if rslt.status = 0 THEN commit; :reset_key := usr.pass_reset_key; else  rollback;  end if; \
                :status := rslt.status ; \
                :msg:= rslt.pushLog().msg; \
             EXCEPTION WHEN OTHERS THEN \
                rslt.savelog();  \
                :status := rslt.status ; \
                :msg:= rslt.pushLog().msg;  \
                rollback;  \
            END;";
            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'signup', {
            http: { path: '/signup', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    User.signupemployer = function (user, cb) {
        var result;
        //        ds.getConnection
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                loginid: user.loginid,
                acname: { val: user.acname, dir: ds.BIND_IN },
                svsid: { val: user.svsid, dir: ds.BIND_IN },

                companyname: { val: user.companyname, dir: ds.BIND_IN },
                actype: { val: user.actype, dir: ds.BIND_IN },

                status: { type: ds.NUMBER, dir: ds.BIND_OUT },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                reset_key: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };


            var sql = "DECLARE rslt    zresult    := zresult();   usr     zUSER      := zUSER();  business zaccount := zAccount(); \
             BEGIN   \
                usr.login_id := :loginid;  \
                usr.email := :loginid;  \
                usr.usrname := :acname; \
                usr.svsid := :svsid; \
                business.acname := :companyname; \
                business.actype := :actype; \
                usr.signup(business, rslt); \
                :reset_key := '';\
                if rslt.status = 0 THEN commit; :reset_key := usr.pass_reset_key; else  rollback;  end if; \
                :status := rslt.status ; \
                :msg:= rslt.pushLog().msg; \
             EXCEPTION WHEN OTHERS THEN \
                rslt.savelog();  \
                :status := rslt.status ; \
                :msg:= rslt.pushLog().msg;  \
                rollback;  \
            END;";
            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'signupemployer', {
            http: { path: '/signupemployer', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );



    User.login = function (user, cb) {
        var result;
        //        ds.getConnection
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                loginid: user.loginid,
                token: { val: user.token, dir: ds.BIND_IN },
                svsid: { val: user.svsid, dir: ds.BIND_IN },
                status: { type: ds.NUMBER, dir: ds.BIND_OUT },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                sesid: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                userid: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                username: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };


            var sql = "DECLARE rslt    zresult    := zresult();   \
                usr     zUSER      := zUSER();  \
                ses      zSESSION := zSESSION(); \
             BEGIN   \
                ses.ip_address := '182.23.29.29';  \
                ses.mac_address := 'alsul34rlasjdf';  \
                ses.user_agent := 'Mozilla';  \
                usr.login_id    := :loginid;  \
                usr.pass        := :token; \
                usr.svsid       := :svsid; \
                usr.login(ses, rslt);      \
                :status := rslt.status ; \
                :msg:= rslt.pushLog().msg; \
                :sesid:= '';   \
                :userid:= '';   \
                :username:= '';   \
                if rslt.status = 0 THEN\
                    :sesid:= ses.session_id;   \
                    :userid:= usr.usrid;   \
                    :username:= usr.usrname;   \
                end if; \
                ses.clear(rslt);  \
            EXCEPTION WHEN OTHERS THEN \
                :status := rslt.status ; \
                :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'login', {
            http: { path: '/login', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    User.profile = function (user, cb) {
        var result;
        //        ds.getConnection
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                user_id: { val: user.user_id, dir: ds.BIND_IN },
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                phone: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                skype_id: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                name: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            /*var sql = "DECLARE \
             rslt    zresult    := zresult();\
             js     zJobseeker := zJobSeeker(160);\
             ses    zsession    := zsession('GY5R5L5N59CPV7JWSXLE4GLIDY3284DI');\
             BEGIN\
             :profile:= js.slct_json(rslt);\
             ses.clear(rslt);\
             if rslt.status = 0 THEN commit; else rollback; end if;\
             EXCEPTION WHEN OTHERS THEN\
             :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
             END;";
             */

            var sql = "DECLARE \
            rslt    zresult    := zresult(1);\
            usr    zUSER := zUSER(:user_id);\
            ses    zsession   := zsession(:sessionid);\
            BEGIN\
            :phone := ''; \
            :skype_id := ''; \
            :name := ''; \
            usr.get(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                :phone := usr.PHONE; \
                :skype_id := usr.SKYPE_ID; \
                :name := usr.usrname; \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'profile', {
            http: { path: '/profile', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );



    User.editprofile = function (user, cb) {
        var result;
        //        ds.getConnection
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                user_id: { val: user.user_id, dir: ds.BIND_IN },
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                phone: { val: user.phone, dir: ds.BIND_IN },
                skype_id: { val: user.skype_id, dir: ds.BIND_IN },
                acname: { val: user.acname, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult(1);\
            usr    zUSER := zUSER(:user_id);\
            ses    zsession   := zsession(:sessionid);\
            BEGIN\
            usr.get(rslt);\
            usr.PHONE := :phone;\
            usr.SKYPE_ID := :skype_id;\
            usr.usrname := :acname; \
            usr.upd(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'editprofile', {
            http: { path: '/editprofile', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );

    /* ************************************************
     Generate New Key (Reset Password)
     ***************************************************/
    User.generateNewKeyResetPass = function (user, cb) {
        var result;
        //        ds.getConnection
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                loginid: { val: user.loginid, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult(1);\
            usr    zUSER := zUSER();\
            BEGIN\
            usr.login_id := :loginid;\
            usr.NEW_KEY(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'generateNewKeyResetPass', {
            http: { path: '/generateNewKeyResetPass', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    /* ************************************************
     UPDATE USER PASSWORD (WITHOUT LOGIN)
     Require RESET PASS KEY
     ***************************************************/
    User.resetPass = function (user, cb) {
        var result;
        //        ds.getConnection
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                user_pass: { val: user.user_pass, dir: ds.BIND_IN },
                reset_key: { val: user.reset_key, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult(1);\
            usr    zUSER := zUSER();\
            BEGIN\
            usr.pass := :user_pass;\
            usr.pass_reset_key := :reset_key;\
            usr.upd_pass(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'resetPass', {
            http: { path: '/resetPass', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );

    /* ************************************************
     UPDATE USER PASSWORD (LOGIN SESSION)
     ***************************************************/
    User.updatePassword = function (user, cb) {
        var result;
        //        ds.getConnection
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                user_id: { val: user.user_id, dir: ds.BIND_IN },
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                user_pass: { val: user.user_pass, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult(1);\
            usr    zUSER := zUSER(:user_id);\
            ses    zsession   := zsession(:sessionid);\
            BEGIN\
            usr.pass := :user_pass;\
            usr.upd_pass(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'updatePassword', {
            http: { path: '/updatePassword', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );
    //*************************************************************************



    // user logout from oracle db
    User.logoutUser = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            BEGIN\
            ses.logout(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'logoutUser', {
            http: { path: '/logoutUser', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );
    // user logout from oracle db




    /////////////////////////////////// Start of Email Templates APIs /////////////////////////////////////////////////////
    // Get All email templates
    User.getAllEmailTemplates = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                data: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000}
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            ET     zEMAIL_TEMPLATE   := zEMAIL_TEMPLATE();\
            v_clob   CLOB; \
            BEGIN\
            v_clob := ET.LIST(rslt);\
            :data := v_clob;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'getAllEmailTemplates', {
            http: { path: '/getAllEmailTemplates', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    // Get Specific email template by ID
    User.getEmailTemplateById = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                RID: { val: user.RID, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                data: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000}
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            ET     zEMAIL_TEMPLATE   := zEMAIL_TEMPLATE();\
            v_clob   CLOB; \
            BEGIN\
            ET.RID  := :RID ; \
            v_clob := ET.GET(rslt);\
            :data := v_clob;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'getEmailTemplateById', {
            http: { path: '/getEmailTemplateById', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );

    // Create New/Edit email template
    User.createEmailTemplate = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                RID: { val: user.RID, dir: ds.BIND_IN },
                NAME: { val: user.NAME, dir: ds.BIND_IN },
                ETYPE: { val: user.ETYPE, dir: ds.BIND_IN },
                SUBJECT: { val: user.SUBJECT, dir: ds.BIND_IN },
                BODY: { val: user.BODY, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            // ET.RID     := 102;  -- To create new pass null

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            ET     zEMAIL_TEMPLATE   := zEMAIL_TEMPLATE();\
            BEGIN\
            ET.RID  := :RID ; \
            ET.NAME  := :NAME ; \
            ET.ETYPE  := :ETYPE ; \
            ET.SUBJECT  := :SUBJECT ; \
            ET.CBODY  := :BODY ; \
            ET.SAVE(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'createEmailTemplate', {
            http: { path: '/createEmailTemplate', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );

    // DELETE Email Template by ID - RID
    User.deleteEmailTemplate = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                RID: { val: user.RID, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            ET     zEMAIL_TEMPLATE   := zEMAIL_TEMPLATE();\
            BEGIN\
            ET.RID  := :RID ; \
            ET.DEL(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'deleteEmailTemplate', {
            http: { path: '/deleteEmailTemplate', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );
    /////////////////////////////////// End of Email Template APIs //////////////////////////////////////////////////////////////



    /////////////////////////////////// Start of Static Content Block APIs //////////////////////////////////////////////////////
    // Get All Static Content Blocks
    User.getAllStaticBlocks = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                data: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000}
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            ET     zEMAIL_STATIC   := zEMAIL_STATIC();\
            v_clob   CLOB; \
            BEGIN\
            v_clob := ET.LIST(rslt);\
            :data := v_clob;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'getAllStaticBlocks', {
            http: { path: '/getAllStaticBlocks', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );

    // Get Static Content Block by ID
    User.getStaticBlockById = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                RID: { val: user.RID, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                data: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000}
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            ET     zEMAIL_STATIC   := zEMAIL_STATIC();\
            v_clob   CLOB; \
            BEGIN\
            ET.RID  := :RID ; \
            v_clob := ET.GET(rslt);\
            :data := v_clob;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'getStaticBlockById', {
            http: { path: '/getStaticBlockById', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    // Create New/Edit Static Content Block
    User.createStaticBlock = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                RID: { val: user.RID, dir: ds.BIND_IN },
                NAME: { val: user.NAME, dir: ds.BIND_IN },
                CONTENT: { val: user.CONTENT, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            // ET.RID     := 102;  -- To create new give null

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            ET     zEMAIL_STATIC   := zEMAIL_STATIC();\
            BEGIN\
            ET.RID  := :RID ; \
            ET.NAME  := :NAME ; \
            ET.CBODY  := :CONTENT ; \
            ET.SAVE(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'createStaticBlock', {
            http: { path: '/createStaticBlock', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    // DELETE Static Block Content ID - RID
    User.deleteStaticBlock = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                RID: { val: user.RID, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            ET     zEMAIL_STATIC   := zEMAIL_STATIC();\
            BEGIN\
            ET.RID  := :RID ; \
            ET.DEL(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'deleteStaticBlock', {
            http: { path: '/deleteStaticBlock', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );
    /////////////////////////////////// END of Static Content Block APIs /////////////////////////////////////////////////////



    /////////////////////////////////// Start of INBOX/Email APIs /////////////////////////////////////////////////////
    /* ************************************************
     PUSH A MAIL MESSAGE (EXTERNAL) INTO SENDING QUEU
     ***************************************************/
    User.pushMessageToQueue = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                APP_ID: { val: user.APP_ID, dir: ds.BIND_IN },
                AUTH_TOKEN: { val: user.AUTH_TOKEN, dir: ds.BIND_IN },
                FROM_EMAIL: { val: user.FROM_EMAIL, dir: ds.BIND_IN },
                FROM_NAME: { val: user.FROM_NAME, dir: ds.BIND_IN },
                TO_USRID: { val: user.TO_USRID, dir: ds.BIND_IN },
                TO_EMAIL: { val: user.TO_EMAIL, dir: ds.BIND_IN },
                CC_EMAIL: { val: user.CC_EMAIL, dir: ds.BIND_IN },
                BCC_EMAIL: { val: user.BCC_EMAIL, dir: ds.BIND_IN },
                ETYPE: { val: user.ETYPE, dir: ds.BIND_IN },
                EMAIL_TEMPLATE_RID: { val: user.EMAIL_TEMPLATE_RID, dir: ds.BIND_IN },
                CDATA: { val: user.CDATA, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            // EML.INBOX_ID - // 1 Internal, 2 external
            // EML.APP_ID - 'rj'
            // EML.STATUS - 0 = NOT FORMATED , 1 = FORMATED
            // EML.ETYPE -- registration, newsletter, subscription etc


            // EML.CBODY := 'fdkh fkhdskhjljdjhsljgdjslgjdj sgjlds j ldjsl fs';
            // EML.SUBJECT       := 'May newsletter';


            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            EML     zEMAIL   := zEMAIL();\
            BEGIN\
            EML.INBOX_ID := 2 ;\
            EML.APP_ID  := :APP_ID;\
            EML.AUTH_TOKEN := :AUTH_TOKEN;\
            EML.FROM_EMAIL := :FROM_EMAIL;\
            EML.FROM_NAME  := :FROM_NAME;\
            EML.TO_USRID := :TO_USRID;\
            EML.TO_EMAIL := :TO_EMAIL;\
            EML.CC_EMAIL := :CC_EMAIL;\
            EML.BCC_EMAIL := :BCC_EMAIL;\
            EML.STATUS := 0;\
            EML.ETYPE := :ETYPE;\
            EML.EMAIL_TEMPLATE_RID := :EMAIL_TEMPLATE_RID;\
            EML.CDATA := :CDATA;\
            EML.PUSH(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'pushMessageToQueue', {
            http: { path: '/pushMessageToQueue', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    /* ************************************************
     Get Message from the Queu for Sending
     ***************************************************/
    User.getMessageFromQueue = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                mail_agent_id: { val: user.mail_agent_id, dir: ds.BIND_IN },
                MessageID: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                UPD_KEY: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                data: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000}
            };

            // i.e --- v_mail_agent_id := 1

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            EML     zEMAIL   := zEMAIL();\
            v_mail_agent_id NUMBER(3);\
            v_clob   CLOB; \
            BEGIN\
            v_mail_agent_id := :mail_agent_id;\
            EML.INBOX_ID := 2;\
            v_clob := EML.GET_MESSAGE_FROM_QUEU(rslt, v_mail_agent_id);\
            :data := v_clob;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            :MessageID := '';\
            :UPD_KEY := '';\
            if rslt.status = 0 THEN commit; :MessageID := EML.RID; :UPD_KEY := EML.UPD_KEY; else  rollback;  end if; \
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'getMessageFromQueue', {
            http: { path: '/getMessageFromQueue', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );

    /* ************************************************
     UPDATE MESSAGE SUBJECT AND BODY AFTER FORMATING
     -- No session id is required
     ***************************************************/
    User.updateMsgSubBody = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                MessageID: { val: user.MessageID, dir: ds.BIND_IN },
                UPD_KEY: { val: user.UPD_KEY, dir: ds.BIND_IN },
                SUBJECT: { val: user.SUBJECT, dir: ds.BIND_IN },
                CBODY: { val: user.CBODY, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            EML     zEMAIL   := zEMAIL();\
            BEGIN\
            EML.INBOX_ID      := 2;\
            EML.RID           := :MessageID;\
            EML.UPD_KEY       := :UPD_KEY;\
            EML.SUBJECT       := :SUBJECT;\
            EML.CBODY         := :CBODY;\
            EML.CDATA         := null;\
            EML.STATUS        := 1;\
            EML.UPD(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'updateMsgSubBody', {
            http: { path: '/updateMsgSubBody', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    /* ************************************************
     Update DELIVERY Status
     ***************************************************/
    User.updateDeliveryStatus = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                MessageID: { val: user.MessageID, dir: ds.BIND_IN },
                UPD_KEY: { val: user.UPD_KEY, dir: ds.BIND_IN },
                Email_Status: { val: user.Email_Status, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            // EML.Email_Status := 'sent';   -- spam, hard bounce, soft bounce, rejected etc

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            EML     zEMAIL   := zEMAIL();\
            BEGIN\
            EML.INBOX_ID      := 2;\
            EML.RID           := :MessageID;\
            EML.UPD_KEY       := :UPD_KEY;\
            EML.Email_Status := :Email_Status;\
            EML.UPD_EMAIL_STATUS(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'updateDeliveryStatus', {
            http: { path: '/updateDeliveryStatus', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    /* ************************************************
     Update Read Status
     ***************************************************/

    User.updateReadStatusPost = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                MessageID: { val: user.MessageID, dir: ds.BIND_IN },
                UPD_KEY: { val: user.UPD_KEY, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };

            // EML.Email_Status := 'sent';   -- spam, hard bounce, soft bounce, rejected etc

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            EML     zEMAIL   := zEMAIL();\
            BEGIN\
            EML.INBOX_ID      := 2;\
            EML.RID           := :MessageID;\
            EML.UPD_KEY       := :UPD_KEY;\
            EML.UPD_READ_STATUS(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'updateReadStatusPost', {
            http: { path: '/updateReadStatusPost', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    /* ************************************************
     ------ Update Read Status GET METHOD ------------
     ***************************************************/

    User.updateReadStatus = function (MessageID, UPD_KEY, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                MessageID: { val: MessageID, dir: ds.BIND_IN },
                UPD_KEY: { val: UPD_KEY, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT }
            };
            // console.log(MessageID);
            // console.log(UPD_KEY);
            // EML.Email_Status := 'sent';   -- spam, hard bounce, soft bounce, rejected etc

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            EML     zEMAIL   := zEMAIL();\
            BEGIN\
            EML.INBOX_ID      := 2;\
            EML.RID           := :MessageID;\
            EML.UPD_KEY       := :UPD_KEY;\
            EML.UPD_READ_STATUS(rslt);\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'updateReadStatus', {
            http: { path: '/updateReadStatus', verb: 'get' },
            //accepts: { arg: ['MessageID', 'UPD_KEY'], type: 'array', http: { source: 'query' } },
            accepts: [
                { arg: 'MessageID', type: 'string', http: { source: 'query' } },
                { arg: 'UPD_KEY', type: 'string', http: { source: 'query' } }
            ],
            //accepts: { arg: 'MessageID', type: 'string', http: { source: 'query' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    /* ************************************************
     Message List (Search)
     ***************************************************/

    User.getEmailMessageListing = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                APP_ID: { val: user.APP_ID, dir: ds.BIND_IN },
                v_from_date: { val: user.v_from_date, dir: ds.BIND_IN },
                v_to_date: { val: user.v_to_date, dir: ds.BIND_IN },
                v_page_no: { val: user.v_page_no, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                data: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000}
            };

            // EML.EMAIL_STATUS := null;  -- sent, ready to sent, in process, rejected
            // EML.ETYPE := null;  -- registration, newsletter, subscription etc
            // EML.READ_STATUS := null;  -- 1 = read, 0 = not read
            // EML.INBOX_ID := 2 ;   -- 1 Internal, 2 external
            // EML.FROM_EMAIL := 'support@rightjobs.pk';
            //v_from_date := '1-JUL-17';
            //v_to_date   := '31-JUL-17';

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            EML     zEMAIL   := zEMAIL();\
            C_LIST   CLOB; \
            v_from_date  DATE;\
            v_to_date    DATE;\
            v_page_no    number;\
            BEGIN\
            v_from_date := :v_from_date;\
            v_to_date   := :v_to_date;\
            v_page_no := :v_page_no;\
            EML.INBOX_ID := 2 ;\
            EML.APP_ID  := :APP_ID;\
            EML.STATUS := null;\
            EML.EMAIL_STATUS := null;\
            EML.ETYPE := null;\
            EML.EMAIL_TEMPLATE_RID := null;\
            EML.READ_STATUS := null;\
            EML.FROM_EMAIL := null;\
            EML.TO_EMAIL := null;\
            EML.SUBJECT := null;\
            C_LIST := EML.SEARCH_LIST(rslt, v_from_date, v_to_date, v_page_no );\
            :data := C_LIST;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'getEmailMessageListing', {
            http: { path: '/getEmailMessageListing', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    /* ************************************************
     Message List Filters (Search)
     ***************************************************/

    User.getMessageListFilters = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                APP_ID: { val: user.APP_ID, dir: ds.BIND_IN },
                v_from_date: { val: user.v_from_date, dir: ds.BIND_IN },
                v_to_date: { val: user.v_to_date, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                totalEmails: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000},
                emailStatus: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000},
                readStatus: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000},
                etype: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000},
                template: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000}
            };

            // EML.STATUS := null;  -- 0 = NOT FORMATED , 1 = FORMATED
            // EML.EMAIL_STATUS := null;  -- sent, ready to sent, in process, rejected
            // EML.ETYPE := null;  -- registration, newsletter, subscription etc
            // EML.READ_STATUS := null;  -- 1 = read, 0 = not read
            // EML.INBOX_ID := 2 ;   -- 1 Internal, 2 external
            // EML.FROM_EMAIL := 'support@rightjobs.pk';
            //v_from_date := '1-JUL-17';
            //v_to_date   := '31-JUL-17';

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            EML     zEMAIL   := zEMAIL();\
            v_from_date  DATE;\
            v_to_date    DATE;\
            v_status_rslt VARCHAR2(1000);\
            v_email_status_rslt VARCHAR2(4000);\
            v_read_status_rslt  VARCHAR2(1000);\
            v_etype_rslt VARCHAR2(4000);\
            v_template_rslt VARCHAR2(4000);\
            BEGIN\
            v_from_date := :v_from_date;\
            v_to_date   := :v_to_date;\
            EML.INBOX_ID := 2 ;\
            EML.APP_ID  := :APP_ID;\
            EML.STATUS := null;\
            EML.EMAIL_STATUS := null;\
            EML.ETYPE := null;\
            EML.EMAIL_TEMPLATE_RID := null;\
            EML.READ_STATUS := null;\
            EML.TO_EMAIL := null;\
            EML.SUBJECT := null;\
            EML.SEARCH_LIST_FC(rslt, v_from_date, v_to_date, v_status_rslt, v_email_status_rslt, v_read_status_rslt,v_etype_rslt, v_template_rslt);\
            :totalEmails := v_status_rslt;\
            :emailStatus := v_email_status_rslt;\
            :readStatus := v_read_status_rslt;\
            :etype := v_etype_rslt;\
            :template := v_template_rslt;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'getMessageListFilters', {
            http: { path: '/getMessageListFilters', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    /* ************************************************
     Message List (Search) + Filters
     ***************************************************/

    User.getMsgListSearchFilters = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                sessionid: { val: user.sessionid, dir: ds.BIND_IN },
                APP_ID: { val: user.APP_ID, dir: ds.BIND_IN },
                v_from_date: { val: user.v_from_date, dir: ds.BIND_IN },
                v_to_date: { val: user.v_to_date, dir: ds.BIND_IN },
                v_page_no: { val: user.v_page_no, dir: ds.BIND_IN },
                v_format_status: { val: user.v_format_status, dir: ds.BIND_IN },
                v_email_status: { val: user.v_email_status, dir: ds.BIND_IN },
                v_email_read_status: { val: user.v_email_read_status, dir: ds.BIND_IN },
                v_email_type: { val: user.v_email_type, dir: ds.BIND_IN },
                v_email_template: { val: user.v_email_template, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                data: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000},
                totalEmails: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000},
                emailStatus: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000},
                readStatus: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000},
                etype: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000},
                template: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000}
            };

            // EML.STATUS := null;  -- 0 = NOT FORMATED , 1 = FORMATED
            // EML.EMAIL_STATUS := null;  -- sent, ready to sent, in process, rejected
            // EML.ETYPE := null;  -- registration, newsletter, subscription etc
            // EML.READ_STATUS := null;  -- 1 = read, 0 = not read
            // EML.INBOX_ID := 2 ;   -- 1 Internal, 2 external
            // EML.FROM_EMAIL := 'support@rightjobs.pk';
            //v_from_date := '1-JUL-17';
            //v_to_date   := '31-JUL-17';

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ses    zsession   := zsession(:sessionid);\
            EML     zEMAIL   := zEMAIL();\
            C_LIST   CLOB;\
            v_from_date  DATE;\
            v_to_date    DATE;\
            v_page_no    number;\
            v_status_rslt VARCHAR2(1000);\
            v_email_status_rslt VARCHAR2(4000);\
            v_read_status_rslt  VARCHAR2(1000);\
            v_etype_rslt VARCHAR2(4000);\
            v_template_rslt VARCHAR2(4000);\
            BEGIN\
            v_from_date := :v_from_date;\
            v_to_date   := :v_to_date;\
            v_page_no := :v_page_no;\
            EML.INBOX_ID := 2 ;\
            EML.APP_ID  := :APP_ID;\
            EML.STATUS := :v_format_status;\
            EML.EMAIL_STATUS := :v_email_status;\
            EML.ETYPE := :v_email_type;\
            EML.EMAIL_TEMPLATE_RID := :v_email_template;\
            EML.READ_STATUS := :v_email_read_status;\
            EML.FROM_EMAIL := null;\
            EML.TO_EMAIL := null;\
            EML.SUBJECT := null;\
            C_LIST := EML.SEARCH_LIST(rslt, v_from_date, v_to_date, v_page_no );\
            :data := C_LIST;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            EML.SEARCH_LIST_FC(rslt, v_from_date, v_to_date, v_status_rslt, v_email_status_rslt, v_read_status_rslt,v_etype_rslt, v_template_rslt);\
            :totalEmails := v_status_rslt;\
            :emailStatus := v_email_status_rslt;\
            :readStatus := v_read_status_rslt;\
            :etype := v_etype_rslt;\
            :template := v_template_rslt;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            ses.clear(rslt);\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'getMsgListSearchFilters', {
            http: { path: '/getMsgListSearchFilters', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );

    /* ************************************************
     GET A PARTICULAR STATIC CONTENT BLOCK (MAIL AGENT) NO SESSION
     ***************************************************/

    User.getStaticBlockMailAgent = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                RID: { val: user.RID, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                data: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000}
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ET     zEMAIL_STATIC   := zEMAIL_STATIC();\
            v_clob   CLOB; \
            BEGIN\
            ET.RID  := :RID ; \
            ET.AUTH_TOKEN := 'zubtjwn0qayy6nzvalarurb6pjqnxhx15v1pidumus6687qtufw4ujtfc88zu6sn'; \
            v_clob := ET.GET(rslt);\
            :data := v_clob;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'getStaticBlockMailAgent', {
            http: { path: '/getStaticBlockMailAgent', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );


    /* ************************************************
     GET A PARTICULAR TEMPLATE (MAIL AGENT)
     ***************************************************/
    User.getETemplByIdMailAgent = function (user, cb) {
        var result;
        ds.getConnection(function (err, connection) {
            if (err) { console.error(err.message); return; }

            var bindvars = {
                RID: { val: user.RID, dir: ds.BIND_IN },
                msg: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                status: { type: ds.VARCHAR, dir: ds.BIND_OUT },
                data: { type: ds.STRING, dir: ds.BIND_OUT , maxSize: 50000}
            };

            var sql = "DECLARE \
            rslt    zresult    := zresult();\
            ET     zEMAIL_TEMPLATE   := zEMAIL_TEMPLATE();\
            v_clob   CLOB; \
            BEGIN\
            ET.RID  := :RID ; \
            ET.AUTH_TOKEN := 'zubtjwn0qayy6nzvalarurb6pjqnxhx15v1pidumus6687qtufw4ujtfc88zu6sn'; \
            v_clob := ET.GET(rslt);\
            :data := v_clob;\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;\
            if rslt.status = 0 \
            THEN \
                commit; \
            else rollback; end if;\
            EXCEPTION WHEN OTHERS THEN\
            :status := rslt.status ; :msg:= rslt.pushLog().msg;  \
            END;";

            connection.execute(sql, bindvars, function (err, result) {
                if (err) {
                    console.error("excuste error " + err.message);
                    return;
                }
                console.log(result.outBinds);
                cb(null, result.outBinds);
            });
        });
    };
    User.remoteMethod(
        'getETemplByIdMailAgent', {
            http: { path: '/getETemplByIdMailAgent', verb: 'post' },
            accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            returns: { arg: 'user', type: 'object' }
        }
    );



    /////////////////////////////////// Start of INBOX/Email APIs /////////////////////////////////////////////////////


};