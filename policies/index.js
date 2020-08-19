const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let usuario = {
  nombre: "",
  apellido: "",
};

let respuesta = {
  error: false,
  codigo: 200,
  mensaje: "",
};

app.get("/", function (req, res) {
  respuesta = {
    error: true,
    codigo: 200,
    mensaje: "Punto de inicio",
  };
  res.send(respuesta);
});

app
  .route("/openAmSetup")  
  .post(function (req, res) {
    const url =
      "http://localhost:8080/openam/json/realms/root/authenticate?goto=http://use1alx223.apexsct.net/";
    const amUser = "amAdmin";
    const amPassword = "11111111";
    let response = {
        resourceType: {},
        policySet: {},
        policySetPolicy: {}
    }
    getToken(url, amUser, amPassword, function (resultObject) {
      const loginInfo = JSON.parse(resultObject);
      createResourceType(loginInfo.tokenId, "json", function (createResourceTypeResult) {
        const resourceTypeInfo = JSON.parse(createResourceTypeResult);
        response.resourceType = resourceTypeInfo;                
        createPolicySet(loginInfo.tokenId, resourceTypeInfo.uuid, "json", function (createPolicySetResult) {
            const policySetInfo = JSON.parse(createPolicySetResult);
            response.policySet = policySetInfo;
            addPolicyToPolicySet(loginInfo.tokenId, resourceTypeInfo.uuid, policySetInfo.name, "json", function (addPolicyToPolicySetResult) {
                const policySetPolicyInfo = JSON.parse(createPolicySetResult);
                response.policySetPolicy = policySetPolicyInfo;
                res.send(response);
            });
        });
      });      
    });
  });

app.use(function (req, res, next) {
  respuesta = {
    error: true,
    codigo: 404,
    mensaje: "URL not found",
  };
  res.status(404).send(respuesta);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

function getToken(url, amUser, amPassword, callback) {
  const options = {
    url: url,
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-OpenAM-Password": amPassword,
      "X-OpenAM-Username": amUser,
      "Accept-API-Version": "resource=2.0, protocol=1.0",
    },
  };

  request(options, function (error, response, body) {    
    callback(body);
  });
}

function createResourceType(token, json, callback) {
  const url = "http://localhost:8080/openam/json/realms/root/resourcetypes/?_action=create";

  const resourceInfo = JSON.stringify({
    name: "ATLAS",
    actions: {      
      "approvals-menu": true,
      "settings-menu": true,
      "order-logs-options": true,
      "order-status-report-option": true,
      "request-forward-stocked-item": true,
      "user-logs-option": true,
      "new-item-for-user": true,
      "self-diagnosis": true,
      "new-forward-stocked-item": true,
      "reports-menu": true,
      "actions-menu": true,
      "self-diagnosis-menu": true
    },
    patterns: ["http://localhost:80/layout/actions/request-type"],
  });

  const options = {
    url: url,
    method: "POST",
    headers: {
        Accept: "application/json",
        "content-type": "application/json",
        iPlanetDirectoryPro: token,
        "Accept-API-Version": "resource=1.0",
    },
    body: resourceInfo,
  };

  request(options, function (error, response, body) {    
    callback(body);
  });
}

function createPolicySet(token, resourceTypeUuid, json, callback) {
  console.log(token);
  const url =
    "http://localhost:8080/openam/json/realms/root/applications/?_action=create";

  const policyInfo = JSON.stringify({
    name: "mypolicyset",
    resourceTypeUuids: [resourceTypeUuid],
    realm: "/",
    conditions: [
      "LEAuthLevel",
      "Policy",
      "Script",
      "AuthenticateToService",
      "SimpleTime",
      "AMIdentityMembership",
      "OR",
      "IPv6",
      "IPv4",
      "SessionProperty",
      "AuthScheme",
      "AuthLevel",
      "NOT",
      "AuthenticateToRealm",
      "AND",
      "ResourceEnvIP",
      "LDAPFilter",
      "OAuth2Scope",
      "Session",
    ],
    applicationType: "iPlanetAMWebAgentService",
    description: "My example policy set.",
    resourceComparator: "com.sun.identity.entitlement.URLResourceName",
    subjects: [
      "Policy",
      "NOT",
      "OR",
      "JwtClaim",
      "AuthenticatedUsers",
      "AND",
      "Identity",
      "NONE",
    ],
    entitlementCombiner: "DenyOverride",
    saveIndex: null,
    searchIndex: null,
    attributeNames: [],
  });

  const options = {
    url: url,
    method: "POST",
    headers: {
      "content-type": "application/json",
      iPlanetDirectoryPro: token,
      "Accept-API-Version": "resource=2.1",
    },
    body: policyInfo,
  };

  request.post(options, function (error, response, body) {
    //let json = JSON.parse(body);
    //console.log(err, res, body);
    ///var responseObject = response.headers;
    //responseObject.body = body;
    //console.log(responseObject);
    callback(body);
  });
}

function addPolicyToPolicySet(token, resourceTypeUuid, policySetName, json, callback) {

    console.log(resourceTypeUuid, policySetName);

    const url =
      "http://localhost:8080/openam/json/realms/root/policies?_action=create";
    const options = {
      url: url,
      method: "POST",
      headers: {
        "content-type": "application/json",
        iPlanetDirectoryPro: token,
        "Accept-API-Version": "resource=1.0",
      },
      body: JSON.stringify({
        "name": "mypolicy",
        "active": true,
        "description": "My Policy.",
        "applicationName": policySetName,
        "actionValues": {
           "approvals-menu": true,
            "settings-menu": true,
            "order-logs-options": true,
            "order-status-report-option": true,
            "request-forward-stocked-item": true,
            "user-logs-option": true,
            "new-item-for-user": true,
            "self-diagnosis": false,
            "new-forward-stocked-item": true,
            "reports-menu": true,
            "actions-menu": true,
            "self-diagnosis-menu": true
        },
        "resources": [
            "http://localhost:80/layout/actions/request-type"
        ],
        "subject": {
            "type": "AND",
            "subjects": [
                {
                    "type": "AuthenticatedUsers"
                },
                {
                    "type": "Identity",
                    "subjectValues": [
                        "id=L1,ou=group,dc=openam,dc=openidentityplatform,dc=org"
                    ]
                }
            ]
        },
        "resourceTypeUuid": resourceTypeUuid
    }),
    };
  
    request(options, function (error, response, body) {
      //let json = JSON.parse(body);
      //console.log(err, res, body);
      ///var responseObject = response.headers;
      //responseObject.body = body;
      //console.log(responseObject);
      callback(body);
    });
  }
