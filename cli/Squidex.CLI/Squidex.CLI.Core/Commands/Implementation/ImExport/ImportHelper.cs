// ==========================================================================
//  Squidex Headless CMS
// ==========================================================================
//  Copyright (c) Squidex UG (haftungsbeschraenkt)
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using System.Globalization;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Squidex.CLI.Commands.Implementation.Utils;
using Squidex.ClientLibrary;

namespace Squidex.CLI.Commands.Implementation.ImExport;

public static class ImportHelper
{
    public static async Task ImportAsync(this ISession session, IImportSettings setting, ILogger log,
        IEnumerable<DynamicData> datas)
    {
        var contents = session.Client.DynamicContents(setting.Schema);

        var totalWritten = 0;

        using (var logLine = log.WriteSameLine())
        {
            var keyField = setting.KeyField;

            var update = new BulkUpdate
            {
                Jobs = new List<BulkUpdateJob>(),
                DoNotScript = false,
                DoNotValidate = false,
                Publish = !setting.Unpublished
            };

            const string op = "eq";

            foreach (var batch in datas.Batch(50))
            {
                update.Jobs.Clear();

                foreach (var data in batch)
                {
                    var job = new BulkUpdateJob
                    {
                        Data = data,
                    };

                    if (keyField != null && keyField.Length != 0)
                    {
                        var keyFilterArray = new List<object>(keyField.Length);
                        foreach (var key in keyField)
                        {
                            var value = setting.IsKeyDeep
                                ? GetTokenByDeepKeyInData(data, key)
                                : GetTokenByKeyInData(data, key);

                            var path = setting.IsKeyDeep ? $"data.{key}" : $"data.{key}.iv";

                            keyFilterArray.Add(new
                            {
                                path,
                                op,
                                value
                            });
                        }

                        object filter = new
                        {
                            and = keyFilterArray
                        };


                        job.Query = new
                        {
                            filter
                        };

                        job.Type = BulkUpdateType.Upsert;
                    }
                    else
                    {
                        job.Type = BulkUpdateType.Create;
                    }

                    update.Jobs.Add(job);
                }


                var result = await contents.BulkUpdateAsync(update);

                var firstError = result.Find(x => x.Error != null)?.Error;
                if (firstError != null)
                {
                    throw new SquidexException<ErrorDto>(firstError.Message, firstError.StatusCode, firstError);
                }

                totalWritten += update.Jobs.Count;

                if (logLine.CanWriteToSameLine)
                {
                    logLine.WriteLine("> Imported: {0}.", totalWritten);
                }
            }
        }

        log.Completed($"Import of {totalWritten} content items completed");
    }

    private static JToken? GetTokenByKeyInData(DynamicData data, string key)
    {
        if (!data.TryGetValue(key, out var temp) || temp is not JObject obj ||
            !obj.TryGetValue("iv", StringComparison.Ordinal, out var value))
        {
            throw new InvalidOperationException($"Cannot find key '{key}' in data.");
        }

        return value;
    }

    private static JToken? GetTokenByDeepKeyInData(DynamicData data, string key)
    {
        var keyParts = key.Split('.');
        switch (keyParts.Length)
        {
            case 0:
                throw new InvalidOperationException($"Invalid deep key '{key}'.");
            case 1:
                return GetTokenByKeyInData(data, key);
        }

        var keyPart = keyParts[0];
        if (!data.TryGetValue(keyPart, out var token))
        {
            throw new InvalidOperationException($"Cannot find key '{key}' in data.");
        }

        foreach (var part in keyParts.Skip(1))
        {
            if (token is JArray)
            {
                token = token[0];
            }

            token = token?.SelectToken(part);

            if (token == null)
            {
                throw new InvalidOperationException($"Cannot find key '{key}' in data.");
            }
        }

        return token;
    }

    public static IEnumerable<DynamicData> Read(this Csv2SquidexConverter converter, Stream stream,
        string delimiter)
    {
        using (var streamReader = new StreamReader(stream))
        {
            var csvOptions = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = delimiter
            };

            using (var reader = new CsvReader(streamReader, csvOptions))
            {
                foreach (var data in converter.ReadAll(reader))
                {
                    yield return data;
                }
            }
        }
    }

    public static IEnumerable<DynamicData> ReadAsArray(this Json2SquidexConverter converter, Stream stream)
    {
        using (var streamReader = new StreamReader(stream))
        {
            using (var reader = new JsonTextReader(streamReader))
            {
                foreach (var data in converter.ReadAll(reader))
                {
                    yield return data;
                }
            }
        }
    }

    public static IEnumerable<DynamicData> ReadAsSeparatedObjects(this Json2SquidexConverter converter,
        Stream stream,
        string separator)
    {
        var sb = new StringBuilder();

        using (var streamReader = new StreamReader(stream))
        {
            string? line;
            while ((line = streamReader.ReadLine()) != null)
            {
                if (line.Equals(separator, StringComparison.OrdinalIgnoreCase))
                {
                    using (var stringReader = new StringReader(sb.ToString()))
                    {
                        using (var reader = new JsonTextReader(stringReader))
                        {
                            yield return converter.ReadOne(reader);
                        }
                    }

                    sb.Clear();
                }
                else
                {
                    sb.AppendLine(line);
                }
            }
        }
    }
}
