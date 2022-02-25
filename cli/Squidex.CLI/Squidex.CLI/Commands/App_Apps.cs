﻿// ==========================================================================
//  Squidex Headless CMS
// ==========================================================================
//  Copyright (c) Squidex UG (haftungsbeschraenkt)
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using CommandDotNet;
using ConsoleTables;
using FluentValidation;
using Squidex.CLI.Commands.Implementation;
using Squidex.CLI.Configuration;
using Squidex.ClientLibrary.Management;

namespace Squidex.CLI.Commands
{
    public partial class App
    {
        [Command("apps", Description = "Manages apps.")]
        [Subcommand]
        public sealed class Apps
        {
            private readonly IConfigurationService configuration;
            private readonly ILogger log;

            public Apps(IConfigurationService configuration, ILogger log)
            {
                this.configuration = configuration;

                this.log = log;
            }

            [Command("list", Description = "List all schemas.")]
            public async Task List(ListArguments arguments)
            {
                var session = configuration.StartSession(arguments.App);

                var apps = await session.Apps.GetAppsAsync();

                if (arguments.Table)
                {
                    var table = new ConsoleTable("Id", "Name", "LastUpdate");

                    foreach (var app in apps)
                    {
                        table.AddRow(app.Id, app.Name, app.LastModified);
                    }

                    table.Write();
                }
                else
                {
                    log.WriteLine(apps.JsonPrettyString());
                }
            }

            [Command("create", Description = "Creates a squidex app.")]
            public async Task Create(CreateArguments arguments)
            {
                var session = configuration.StartSession(arguments.App);

                var name = arguments.App;

                if (string.IsNullOrWhiteSpace(name))
                {
                    name = session.App;
                }

                var request = new CreateAppDto
                {
                    Name = name
                };

                await session.Apps.PostAppAsync(request);

                log.WriteLine("> App created.");
            }

            public sealed class ListArguments : AppArguments
            {
                [Option('t', "table", Description = "Output as table")]
                public bool Table { get; set; }

                public sealed class Validator : AbstractValidator<ListArguments>
                {
                }
            }

            public sealed class CreateArguments : AppArguments
            {
                public sealed class Validator : AbstractValidator<CreateArguments>
                {
                }
            }
        }
    }
}
