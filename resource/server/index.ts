import { checkDependency } from '@overextended/ox_lib'
import './init'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('oxmysql', '2.14.3', true)

SetConvarReplicated('sv_showBusySpinnerOnLoadingScreen', 'false');