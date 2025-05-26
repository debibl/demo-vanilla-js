import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getPartners: () => ipcRenderer.invoke('getPartners'),
  getDiscount: (id) => ipcRenderer.invoke('getDiscount', id),
  addPartner: (partner) => ipcRenderer.invoke('addPartner', partner),
  editPartner: (partner) => ipcRenderer.invoke('editPartner', partner),
  getPartnerById: (id) => ipcRenderer.invoke('getPartnerById', id)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
