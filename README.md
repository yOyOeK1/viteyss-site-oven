# viteyss-site-oven

![](./assets/ico_mafinOven_64_64.png) Oven is a define recipe / set ingreadiance / post-process / wrap it ... Beaking place 

gui for bash with some rerouting.

## what it solves for me

N number of lost / forgotten / misplaced scripts and tasks can be in one place. Rapid / asci / directory / link base system for configuration.

So Cook Book holds sets of recipes. For something what I want / need to do. 

* bash can have graphical output `out of the box`

* instance execution of your recipe

* fast command test place with option to store it as channel in CookBook, local cmd history / favorit 

* battery alert if battery to low show toast

* button to add record to database

* ...

### Bakeing recipe

Recipe can be Baked in oven as one shot or long time live process.

stdio is main source of data sourcing for next step

**line** or block of result of text can be postProcess as 

* A raw

* A secLeft

* W percent

* W percent bar

* [x] A progress bar ascii

* ...

Then it's passing it to wrapping section ...

### wrapping it

It's possible to set recipe that it can wrapped our product in:

* W toast - temporary popup on screen in corner

* external x-terminal-emulator

* W log

* [ ] widget / channel of recipe it self
- [ ] to ENV as variable

- [ ] to trigger other channel

- [ ] system notification ( gnome or make recepy with args )

#### screenshoot

####### ver 26012x ... state chaos working

![](./examples/screen_topSection_26012x.png) Top part with some custom debug action buttons end debug links as it's work in progress.

![](./examples/screen_CookBookRoot_26012x.png)

![](./examples/screen_cmdTestPlaceLogs_26012x.png)
![](./examples/screen_logingItSelf_26012x.png)
![](./examples/screen_logOfInerativeRecipe_26012x.png) Log of iterative recipe Ram use / total Gi from `free`

![](./examples/screen_settingRecipe_26012x.png)



#### xdoc

Started Beaking recipe is getting some ENV variables to help it to do the things ..

- [x] set ENV on run time, prefix `oven_`:
  
  - [x] `oven_home` - ~/.viteyss/oven
  
  - [x] `oven_adressURL` - CookBook adress from `oven_home`
  
  - [x] `oven_my_chNo`
  
  - [x] `oven_my_rName`

#### notes

```info
A - [ ] asci posible to worki in terminal
W - [ ] web browser version
```

- [ ] from recipe click
  
  - [ ] see that it's not run - W
  
  - [ ] see that it's started - W
    
    - [ ] show type shared | reconnected / not shared - process 
    - [x] in cmd - results
  
  - [ ] see chunks if needed - log 
    
    - [x] in cmd - results
  
  - [ ] see  esult if needed
    
    - [x] in cmd - results
  
  - [ ] mark exitCode
    
    - [x] in cmd - results
  
  - [ ] get result if needed to widget / channel No

- [ ] from Baking recipe
  
  - [ ] need to hide / show on edit mode 
  
  - [x] now can save to channel 
  
  - [x] in subs CookBooks

- [ ] from cmd / cmd - results at bottom as tool
  
  - [ ] cleaning logs is iffi

- [ ] valType scripts at server site / shs

- [ ] common cookbok with set arguments types to use: shs scripts?

- [ ] handle `read -r` from bash

- [ ] process kill when client leavs

- [ ] postprocess to server site

- [ ] wrapper to server site

- [ ] directory layout for config
  
  - [x] cookBook swapping

...

---

If you see that this makes sense [ send me a ☕ ](https://ko-fi.com/B0B0DFYGS) | [Master repository](https://github.com/yOyOeK1/oiyshTerminal) | [About SvOiysh](https://www.youtube.com/@svoiysh)
