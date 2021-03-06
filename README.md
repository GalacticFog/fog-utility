# Gestalt `fog` CLI Utility

Github Repository: https://github.com/GalacticFog/gestalt-fog-cli

Client utility for Gestalt Platform (similar to `kubectl` for Kubernetes and `dcos` for DC/OS).

## Download

Download from Github:

```sh
# Download
version=`curl -o - https://raw.githubusercontent.com/GalacticFog/gestalt-fog-cli/master/LATEST`

# MacOS
curl -L "https://github.com/GalacticFog/gestalt-fog-cli/releases/download/$version/gestalt-fog-cli-macos-$verzion.zip" -o fog.zip

# Linux
curl -L "https://github.com/GalacticFog/gestalt-fog-cli/releases/download/$version/gestalt-fog-cli-linux-$verzion.zip" -o fog.zip

unzip -o fog.zip

mv fog /usr/local/bin # Or somewhere in your PATH
```

## Login to a Gestalt Environment
```
# Login to an environment:
fog login
```

## Run from Source

`fog` requires node and npm for running from source.

```sh
cd gestalt-fog-cli/cli
npm install
./fog
```

## Binary Installation from Source

Building from source bundles the nodejs engine with the `fog` code to provide a single binary with minimal external dependencies.

```
npm run build:local // or yarn build:local

# for Linux
cp ./target/linux/fog /usr/local/bin/fog

# for MacOS
cp ./target/macos/fog /usr/local/bin/fog
```

## Set up Bash Completion
```sh
fog completion bash >> ~/.bashrc

# Log out of your shell, and re-login

fog <tab, tab>                       # Autocomplete

fog show <tab, tab>                  # Autocomplete the command

fog create resource --f<tab, tab>    # Autocomplete the command flag

```

## Discover commands
```sh
# Help
fog --help
fog [command] --help
```

## Login to Gestalt Platform
```sh
fog login                                           # Interactively
fog login <url>                                     # Prompts for username, password
fog login <url> -u <username>                       # Only prompts for password
fog login <url> -u <username> -p <password>         # No prompts
```

## Working with Sessions
```sh
fog use         # List sessions

fog use test    # Switch to a 'test' session (creates a new session if it doesn't exist)

fog login       # Logs into an environment via the 'test' session

fog use local   # Switch to a 'local' session (creates a new session if it doesn't exist)

fog login       # Logs into an environment via the 'local' session

fog use         # List sessions

fog status      # Show more detais about sessions

fog session rm test   # Remove the 'test' session
```

## Working with Context
```sh
fog show hierarchy --raw                   # Show all context paths

fog context set /sandbox/                  # Set context to a specific org

fog context set /sandbox/dev-sandbox       # Set context to a specific workspace

fog context set /sandbox/dev-sandbox/dev   # Set context to a specific environment

fog context set                            # Select the context interactively

fog status                                 # Show the current Session and context

```


## Showing resources
```sh
fog show orgs                                   # Show orgs

fog show workspaces /                           # Show all workspaces

fog show environments /                         # Show all environments

fog show hierarchy                              # Show all context paths (Orgs, Workspaces, Environments)

fog show providers /root                        # Show providers in /root

fog show providers --type CaaS                  # Show filtered list of providers

fog show lambdas                                # Show lambdas in the current context

fog show lambdas /                              # Show all lambdas

fog show containers                             # Show in the current context

fog show conatiners /                           # Show all

fog show containers /root                       # Show in the specified org

fog show containers /root/dev-sandbox           # Show in the specified workspace

fog show containers /root/dev-sandbox/dev       # Show from a specific environment

fog show --help  # Show other available resource types (policies, datafeeds, secrets, users, groups, etc)

```

## Creating resources
```
fog create resource -f example.yaml

fog create resource -f example.yaml --name 'override-the-name' --description 'Override the description'

fog create resource -f example.yaml --context /root/dev-sandbox/dev

fog create resource -f example.yaml --provider 'default-kubernetes'

fog create resource -f example.yaml --render-only

```


## Enabling / Disabling debug
```sh
fog config set debug=true

fog config unset debug

fog config view
```

## Container actions
```sh
fog create resource -f nginx-container-spec.json --name nginx --description 'My NGINX container'

fog scale container 'nginx' 3

fog migrate container 'nginx' /root/default-kubernetes

fog promote container 'nginx' prod

fog delete container 'nginx'

# Interactive commands

fog clone containers

fog migrate containers

fog promote containers

fog delete containers

```

## Exporting resources
```sh
fog export resources                       # Export the current environment's resources to the current directory 

fog export resources --all -d export1      # Export the current environment's resources to the 'export1' directory 

fog export hierarchy / --all         # Export everything as portable resources (including Orgs, Workspaces, Environments)

fog export hierarchy / --all --raw   # Export "raw" - don't dereference resource IDs or strip environment-specific info

fog export hierarchy /engineering    # Export the 'engineering' org

fog export hierarchy /engineering/myworkspace -d ../Export1   # Export to the ../Export1 directory

```

## Admin Commands
```sh
# Generate API key for specified user (typically for service accounts)
fog admin generate-api-key --user admin --org root --key $rootkey --secret $rootsecret
```

# Commands List
```
fog admin <command>
  fog admin add-user-to-group [user]        Add user to group
  [group]
  fog admin apply-entitlements [path]       Apply entitlements from file
  fog admin create-account-store [file]     Create Account Store
  fog admin create-directory [file] [org]   Create LDAP directory
  fog admin create-group [name]             Create group
  [description]
  fog admin delete-directory [name] [org]   Delete LDAP directory
  fog admin generate-api-key [user]         Generate Gestalt Security API key
  fog admin list-entitlements               List entitlement actions at the
  [context_path]                            specified context
  fog admin remove-user-from-group [user]   Remove user from group
  [group]
  fog admin show-account-stores [org]       Show account stores
  fog admin show-directories [org]          Show LDAP directories
  fog admin show-directory-accounts [name]  Show LDAP directories
  fog admin show-directory-groups [name]    Show LDAP directories
  fog admin show-groups [org]               Show groups
  fog admin update-license [file]           Update Gestalt license

fog bash-completion     Show Bash Completion Script

fog clone <command>
  fog clone containers  Clone containers

fog completion <command>  Shell completion commands
  fog completion bash  Show Bash Completion Script

fog config <command>
  fog config set [args...]    Set config
  fog config unset [args...]  Unset config
  fog config view             view config

fog context <command>
  fog context get-browser-url [path]  get-browser-url
  fog context reset                   Reset context
  fog context select-environment      Change environment
  fog context select-org              Change org
  fog context select-workspace        Change workspace
  fog context set [path]              Set context
  fog context show                    Shows the current context

fog create <command>
  fog create api [name]            Create API
  fog create apiendpoint [name]    Create API Endpoint
  fog create container [name]      Create container
  fog create environment [name]    Create environment
  fog create lambda [name]         Create lambda
  fog create org [name]            Create org
  fog create policyrule            Create policy rule
  fog create resource [name]       Create resource
  fog create resources [files...]  Create resources
  fog create workspace [name]      Create workspace

fog delete <command>
  fog delete api [api_name]              Delete api
  fog delete container [container_name]  Delete container
  fog delete containers                  Delete containers
  fog delete environment [context_path]  Delete environment
  fog delete group [name]                Delete group
  fog delete lambda [lambda_name]        Delete lambda
  fog delete lambdas                     Delete lambdas
  fog delete org [fqon]                  Delete org
  fog delete policy [policy_name]        Delete policy
  fog delete user [name]                 Delete user
  fog delete workspace [context_path]    Delete workspace

fog export <command>
  fog export hierarchy [context_path]  Export hierarchy
  fog export resources [context_path]  Export environment resources

fog login               Log in to Gestalt Platform Instance

fog logout              Logout of Gestalt Platform Instance

fog meta <command>
  fog meta DELETE [path]   HTTP functions
  fog meta GET [path]      HTTP functions
  fog meta PATCH [path]    HTTP functions
  fog meta POST [path]     HTTP functions
  fog meta PUT [path]      HTTP functions
  fog meta patch-provider  HTTP functions

fog migrate <command>
  fog migrate container [container_name]    Migrate container
  fog migrate containers                    Migrate containers

fog promote <command>
  fog promote container [container_name]    Promote container
  fog promote containers                    Promote containers

fog restart <command>
  fog restart containers  Restart containers

fog scale <command>
  fog scale container [container_name]      Scale container

fog security <command>
  fog security DELETE [path]        HTTP functions
  fog security GET [path]           HTTP functions
  fog security PATCH [path] [file]  HTTP functions
  fog security POST [path]          HTTP functions
  fog security PUT [path]           HTTP functions

fog service <command>
  fog service deploy   Deploy a Service
  fog service package  Package a Service

fog show <command>
  fog show apiendpoints [context_path]  Show apiendpoints
  fog show apis [context_path]          Show apis
  fog show containers [context_path]    Show containers
  fog show datafeeds [context_path]     Show datafeeds
  fog show entitlements [context_path]  Show entitlements
  fog show environments [context_path]  List enviornments
  fog show group-members                List group members
  fog show groups                       List groups
  fog show hierarchy                    Show the hierarchy
  fog show lambdas [context_path]       Show lambdas
  fog show orgs                         List orgs
  fog show policies [context_path]      Show policies
  fog show policyrules [context_path]   Show policyrules
  fog show providers [context_path]     List providers
  fog show secrets [context_path]       Show secrets
  fog show streamspecs [context_path]   Show streamspecs
  fog show users                        List users
  fog show volumes [context_path]       Show volumes
  fog show workspaces [context_path]    List workspaces

fog status              Show Status
```

## Resource Templates

Resource templates can be in either JSON or YAML format.  The following template directives are supported:

```
#{Config CONFIG_KEY} - Replaces with the config value CONFIG_KEY from the --config <file> or from environment variable

#{Provider /root/provider-name id} - Replaces with the ID of the named provider

#{Lambda /root/workspace/env/lambda-name id} - Replaces with the ID of the named lambda

#{Environment /root/workspace/env id} - Replaces with the ID of the named environment

```

Example Usage:

```
# The following gets replaced with the ID of the provider 'default-laser'
...
        "provider": {
            "id": "#{Provider /root/default-laser id}",
            "locations": []
        },
...


fog create resource -f template.json      # Creates the resource from template

fog create resource -f template.json --config config.yaml      # Creates the resource from template, using a config file for paramters

```
