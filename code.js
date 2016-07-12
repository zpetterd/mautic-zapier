var Zap = {
   // search_lead_search: function(bundle) {
      //var tagFixed = fixTagsFormat(bundle.cleaned_request);
        //var fieldsFixed = fixLeadData(tagFixed);
        //return fieldsFixed;
      //  return bundle.cleaned_request;
   // },

    search_lead_post_read_resource: function(bundle){
        var dataObj = {};
        dataObj = bundle.read_fields;

        console.log(dataObj);
        dataObj.tags = newFixTagsFormat(dataObj.tags);
        console.log(dataObj);
        var fieldsFixed = fixLeadFields(dataObj);
        console.log(fieldsFixed);

        return fieldsFixed;
    },
    create_lead_pre_write: function(bundle) {
        var request = bundle.request;

        if (bundle.action_fields_full.lead_id){
            request.method = 'PUT';
        } else {
            request.url = bundle.auth_fields.domain + "/api/leads/new";
        }
        return request;
    },

    update_lead_pre_write: function(bundle){
        var request = bundle.request;
        request.method = 'PUT';
        return request;
    },



    lead_deleted_catch_hook: function(bundle) {
        return fixTagsFormat(bundle.cleaned_request["mautic.lead_post_delete"]);
    },

    lead_point_change_catch_hook: function(bundle) {
        var tagFixed = fixTagsFormat(bundle.cleaned_request["mautic.lead_points_change"]);

        var fieldsFixed = fixLeadData(tagFixed);
        return fieldsFixed;
    },

    form_submitted_catch_hook: function(bundle) {
        var submissions;
        for (var i in bundle.cleaned_request["mautic.form_on_submit"]) {            // Clean each of the lead objects under the submission
            var lead = bundle.cleaned_request["mautic.form_on_submit"][i].submission.lead;
            lead = fixLeadFields(lead);
            bundle.cleaned_request["mautic.form_on_submit"][i].submission.lead = lead;

        }
        if (bundle.cleaned_request["mautic.form_on_submit"].length > 1){
            console.log("multi");
            submissions = [];

            for (i in bundle.cleaned_request["mautic.form_on_submit"]){
                var submission = bundle.cleaned_request["mautic.form_on_submit"][i].submission;
                submissions.push(submission);
            }

        } else {
            console.log("single");
            submissions = {};
            submissions = bundle.cleaned_request["mautic.form_on_submit"][0].submission;
        }
        return submissions;
        //var lead = bundle.fixLeadFields
        //return fixTagsFormat(bundle.cleaned_request["mautic.form_on_submit"]);
    },

    page_hit_catch_hook: function(bundle) {
        var pageHits;


        for (var i in bundle.cleaned_request["mautic.page_on_hit"]) {            // Clean each of the lead objects under the submission
            var lead = bundle.cleaned_request["mautic.page_on_hit"][i].hit.lead;
            lead = fixLeadFields(lead);
            bundle.cleaned_request["mautic.page_on_hit"][i].hit.lead = lead;
            bundle.cleaned_request["mautic.page_on_hit"][i].hit.timestamp = bundle.cleaned_request["mautic.page_on_hit"][i].timestamp;

        }
        if (bundle.cleaned_request["mautic.page_on_hit"].length > 1){
            console.log("multi");
            pageHits = [];

            for (i in bundle.cleaned_request["mautic.page_on_hit"]){
                var submission = bundle.cleaned_request["mautic.page_on_hit"][i].hit;
                pageHits.push(submission);
            }

        } else {
            console.log("single");
            pageHits = {};
            pageHits = bundle.cleaned_request["mautic.page_on_hit"][0].hit;
        }
        return pageHits;
    },

    email_opened_catch_hook: function(bundle) {
        var emailOpened;


        for (var i in bundle.cleaned_request["mautic.email_on_open"]) {            // Clean each of the lead objects under the submission

            var tagFixed = fixTagsFormat(bundle.cleaned_request["mautic.email_on_open"][i]);
            bundle.cleaned_request["mautic.email_on_open"][i] = tagFixed;

            var lead = bundle.cleaned_request["mautic.email_on_open"][i].stat.lead;
            lead = fixLeadFields(lead);
            bundle.cleaned_request["mautic.email_on_open"][i].stat.lead = lead;
            bundle.cleaned_request["mautic.email_on_open"][i].stat.timestamp = bundle.cleaned_request["mautic.email_on_open"][i].timestamp;

        }
        if (bundle.cleaned_request["mautic.email_on_open"].length > 1){
            console.log("multi");
            emailOpened = [];

            for (i in bundle.cleaned_request["mautic.email_on_open"]){
                var emailOpen = bundle.cleaned_request["mautic.email_on_open"][i].stat;
                emailOpened.push(emailOpen);
            }

        } else {
            console.log("single");
            emailOpened = {};
            emailOpened = bundle.cleaned_request["mautic.email_on_open"][0].stat;
        }
        return emailOpened;
    },

    lead_updated_catch_hook: function(bundle) {
        var tagFixed = fixTagsFormat(bundle.cleaned_request["mautic.lead_post_save_update"]);
        var fieldsFixed = fixLeadData(tagFixed);
        return fieldsFixed;
    },

    new_lead_catch_hook: function(bundle) {
        var tagFixed = fixTagsFormat(bundle.cleaned_request["mautic.lead_post_save_new"]);
        var fieldsFixed = fixLeadData(tagFixed);
        return fieldsFixed;
    },

    new_lead_basic_info_post_poll: function(bundle) {
         var data = JSON.parse(bundle.response.content).leads;

        var result = [];
        var total = 0;
        for (var i = 0; i < data.length; i++){
           if ((!isEmpty(data[i].fields.all.email)) & (!isEmpty(data[i].fields.all.firstname)) & (!isEmpty(data[i].fields.all.lastname))) {        /// They should return true when they are valid
                result[total] = data[i];
               total++;
           }

        }

        return result;
    },

    new_last_action_post_poll: function(bundle) {
        var data = JSON.parse(bundle.response.content).leads;

        var result = [];
        var total = 0;
        for (var i = 0; i < data.length; i++) {
        if ((data[i].fields.all.lastaction == bundle.trigger_fields.last_action_value) & (!isEmpty(data[i].fields.all.email))){
                        result[total] = data[i];
               total++;
        }

        }
        return result;
    },

    create_lead_post_custom_action_fields: function(bundle) {
        var data = JSON.parse(bundle.response.content);

        var totalFields = [];
        var fields = {};
        for (var i in data){
            var curField = {};
            curField.type = "unicode";
            curField.key = data[i].alias;
            curField.required = false;
            curField.label = data[i].label;
            curField.help_text = "";
            totalFields.push(curField);
        }
        return totalFields;
    },

        update_lead_post_custom_action_fields: function(bundle) {
        var data = JSON.parse(bundle.response.content);

        var totalFields = [];
        var fields = {};
        for (var i in data){
            var curField = {};
            curField.type = "unicode";
            curField.key = data[i].alias;
            curField.required = false;
            curField.label = data[i].label;
            curField.help_text = "";
            totalFields.push(curField);
        }
        return totalFields;
    },

    add_lead_list_post_custom_action_fields: function(bundle) {
        var data = JSON.parse(bundle.response.content);
        var result = [
             {
            "type": "unicode",
            "key": "lead_list",
            "required": false,
            "label": "Mautic Lead list",
            "help_text": "Select the list the lead should be added to."
              }
            ];
        var choices = {};
          for (var i in data){
              var num = Number(data[i].id);
              choices[num]= data[i].name;
            }
          result[0].choices = choices;
          return result;
    },

     lead_list_remove_post_custom_action_fields: function(bundle) {
        var data = JSON.parse(bundle.response.content);
        var result = [
             {
            "type": "unicode",
            "key": "lead_list",
            "required": false,
            "label": "Mautic Lead list",
            "help_text": "Select the list the lead should be added to."
              }
            ];
        var choices = {};
          for (var i in data){
              var num = Number(data[i].id);
              choices[num]= data[i].name;
            }
          result[0].choices = choices;
          return result;
    },

     new_lead_lastdownload_post_poll: function(bundle) {
                var data = JSON.parse(bundle.response.content).leads;

        var result = [];
        var total = 0;
        for (var i = 0; i < data.length; i++) {
        if ((data[i].fields.all.lastaction == bundle.trigger_fields.last_action_value) & (!isEmpty(data[i].fields.all.email))){
                        result[total] = data[i];
               total++;
        }

        }
        return result;
    },

    new_lead_data_post_poll: function(bundle) {
        var data = JSON.parse(bundle.response.content).leads;

        var result = [];
        var total = 0;
        for (var i = 0; i < data.length; i++){
           if (!isEmpty(data[i].fields.all.email)) {        /// They should return true when they are valid
                result[total] = data[i];
               total++;
           }

        }

        return result;
    }



};

function isEmpty(value){
  return (value === null || value.length === 0);
}

function fixTagsFormat(responseBundle){
    for (var i in responseBundle){
        if (responseBundle[i].hasOwnProperty("lead") && responseBundle[i].lead.hasOwnProperty("tags")){
            var tagsObj = responseBundle[i].lead.tags;
            var tagsString = [];
            var numTags = Object.keys(tagsObj).length;
            var x = 0;
            for (var t in tagsObj){
                tagsString += t;
                if (x != numTags-1)
                    tagsString += ",";

                x++;
            }
            responseBundle[i].lead.tags = tagsString;
       }
    }
    return responseBundle;
}

function newFixTagsFormat(tagsObj){
    var tagsString = [];
    var numTags = Object.keys(tagsObj).length;
    var x = 0;
    for (var t in tagsObj){
        tagsString += t;
        if (x != numTags-1)
            tagsString += ",";

        x++;
    }
    return tagsString;

}
function fixLeadData(data){
    var newData;

    if (Array.isArray(data) && data.length > 1) {
        console.log("array");
        newData = [];
        for (var i in data) {
            var newLead = fixLeadFields(data[i].lead);

        }
    } else {
        console.log("single");
        if (Array.isArray(data)) data = data[0];
        newData = {};
        newData = fixLeadFields(data.lead);

    }
    return newData;

}

function fixLeadFields(lead){
    var procLead = {};
    for (var topKey in lead){
        if (topKey != "fields"){
            procLead[topKey] = lead[topKey];        //copy accross all but fields
        }

    }

    for (var section in lead.fields){
        for (var name in lead.fields[section]){
            if(!procLead.hasOwnProperty(name)) procLead[name] = lead.fields[section][name].value;
        }
    }

    procLead.ipAddresses = fixIPs(procLead.ipAddresses);
    return procLead;
}

function fixIPs(ipObj){
    var ipArray = [];

    for (var ip in ipObj){
        ipArray.push(ip);
    }
    return ipArray;
}

function flatten(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}
