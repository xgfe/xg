# xg
Front-end Integrated Solution for xgfe based on [Fis3](https://github.com/fex-team/fis3)

## install
````
$ [sudo] npm install -g xg
````

## use
```
xg server start     // start inner node server
xg release -wL      // release code to local server space for test
xg release pre -wL  // release code to local server space with compression and combination for preview brefore submit
xg release pub      // release code to `../dist` file with compression and combination for publish
```

## xg config

xg need a `.xgconfig` file in the development root file, eg `/src`.  
Now, we just declare the type of project.

```
// .xgconfig
{
  "type": "angular"
}
```

## transpond config
xg use [xg-server-node](https://github.com/xgfe/xg-server-node) as the default node server, which provide auto transpond ability with sample configuration. see more: [https://github.com/xgfe/xg-server-node](https://github.com/xgfe/xg-server-node)

**It's compatible with [fis3](https://github.com/fex-team/fis3)**