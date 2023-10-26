<?php
/*
    Request Types:
    - GET:  Can be used to get information about a group
        DEFAULT operation: get information about all groups for which a user is a member
            - Request:
                - Headers:
                    - cookies: session_id=***
                - URL Parameters:
                    - brief=[true | false]
            - Response:
                - Status Codes:
                    - 200 if group information was fetched correctly
                    - 400 if url parameters are invalid
                    - 401 if session_id cookie is not present or invalid
                    - 500 if the database could not be reached
                - Content-Type:application/json
                - body: serialized JSON in the following format
                    {
                        'message':<RESULT>,
                        'groups':
                        [
                            {
                                'group_name':<GROUP NAME>,
                                'group_id:<GROUP ID>,
                                'debt':<DEBT>,
                                'members':
                                [
                                    {
                                        'user':<USERNAME/EMAIL>,
                                        'user_id:<USER ID>,
                                        'debt':<DEBT>
                                    },
                                    ...,
                                    {}
                                ]
                            },
                            ...,
                            {}
                        ]
                    }
                    The 'members' list does not include the currently logged in user.
                    'debt' is an integer value that is the (positive) amount the user owes or the (negative) amount the user is owed.
                    If `brief=true` in the URL parameters, the 'members' node is omitted from all groups.
                    <RESULT> is a message explaining the status code to a user.
        GROUP INFO operation: get information about a certain group
            - Request:
                - Headers:
                    - cookies: session_id=***
                - URL Parameters:
                    - brief=<true | false>
                    - groupID=<GROUP ID>
            - Response:
                - Status Codes:
                    - 200 if group information was fetched correctly
                    - 400 if url parameters are invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if the currently logged in user is not a member of the specified group or the group does not exist
                    - 500 if the database could not be reached
                - Content-Type:application/json
                - body: serialized JSON in the following format
                    {
                        'message':<RESULT>,
                        'group_name':<GROUP NAME>,
                        'group_id:<GROUP ID>,
                        'debt':<DEBT>,
                        'members':
                        [
                            {
                                'user':<USERNAME/EMAIL>,
                                'user_id:<USER ID>,
                                'debt':<DEBT>
                            },
                            ...,
                            {}
                        ]
                    }
                    The 'members' list does not include the currently logged in user.
                    'debt' is an integer value that is the (positive) amount the user owes or the (negative) amount the user is owed.
                    If `brief=true` in the URL parameters, the 'members' node is omitted.
                    <RESULT> is a message explaining the status code to a user.
    - POST: Used to perform multiple operations, where the operation is specified by a key provided in JSON
        CREATE operation: create a group and add the given users to the group
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        'operation':'create',
                        'group_name':<GROUP NAME>,
                        'members':
                        [
                            {
                                'user':<USERNAME/EMAIL>,
                                'user_id:<USER ID>
                            },
                            ...,
                            {}
                        ]
                    }
                    Where either 'user':<USERNAME/EMAIL> OR 'user_id:<USER ID> are specified for each user.
                    If both username/email and user ID are specified, the user ID will be used.
            - Response:
                - Status Codes:
                    - 200 if user successfully created the group and added all users
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if one or more specified user(s) does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        'message':<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
        ADD_USER operation: add a specified user to the specified group
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        'operation':'add_user',
                        'group_id:<GROUP ID>,
                        'user':<USERNAME/EMAIL>,
                        'user_id:<USER ID>
                    }
                    And where either 'user':<USERNAME/EMAIL> OR 'user_id:<USER ID> are specified.
                    If both username/email and user ID are specified, the user ID will be used.
            - Response:
                - Status Codes:
                    - 200 if user was successfully added to the group
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if currently logged in user is not a member of this group, group does not exist, or user does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        'message':<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
        DELETE operation:   delete the specified group
                            only works if the currently logged in user is a member of the group
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        'operation':'delete',
                        'group_id:<GROUP ID>,
                    }
            - Response:
                - Status Codes:
                    - 200 if group was successfully deleted
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if currently logged in user is not a member of this group or group does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        'message':<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
        RENAME operation:   change the name of the specified group
                            only works if the currently logged in user is a member of the group
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        'operation':'rename',
                        'group_id:<GROUP ID>,
                        'group_new_name':<NEW GROUP NAME>
                    }
            - Response:
                - Status Codes:
                    - 200 if group was successfully renamed
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if currently logged in user is not a member of this group or group does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        'message':<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
        LEAVE operation:    remove the current user from the specified group, if they are present
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        'operation':'leave',
                        'group_id:<GROUP ID>,
                    }
            - Response:
                - Status Codes:
                    - 200 if user successfully left the group
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if currently logged in user is not a member of this group or group does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        'message':<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
*/

include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/jsonMessage.php');



?>
