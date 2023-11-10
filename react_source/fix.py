import re

file = "./modals/UploadIcon.js"

f = open(file, "r")

string = f.read()



found = re.findall("style *?= *?{ *?\[.*?\] *?}", string, flags=re.DOTALL)

for s in found:
    temp = re.search("\[.*?(?=\])", s, flags=re.DOTALL)
    splits = temp.group()[1:].split(",");
    out = "style={{";
    for i in range(0, len(splits)):
        out += " ..." + splits[i].strip()
        if i != len(splits) - 1:
            out+= ","
    out+= "}}"
    print(out);

    string = string.replace(s, out);

print(string);

f.close()

f = open(file, "w")
f.write(string)
f.close()