# Social Spending executables

This folder contains programs designed for _speed_.

### C++ Prerequisites

Must install g++ compiler and make:

```
sudo apt install g++ make
```

The C++ standard library included with XAMPP was outdated, I linked to the system's copy of `libstdc++.so.6` in `/usr/lib/x86_64-linux-gnu` by doing the following:
```bash
sudo mv /opt/lampp/lib/libstdc++.so.6 /opt/lampp/lib/libstdc++.so.6.old
sudo ln -s /usr/lib/x86_64-linux-gnu/libstdc++.so.6 /opt/lampp/lib/libstdc++.so.6
```

