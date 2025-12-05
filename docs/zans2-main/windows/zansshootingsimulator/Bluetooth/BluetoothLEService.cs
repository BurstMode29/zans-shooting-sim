using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.ReactNative.Managed;

using Windows.Devices.Enumeration;
using Windows.Devices.Bluetooth;
using Windows.Devices.Bluetooth.GenericAttributeProfile;
using Windows.Storage.Streams;

namespace zansshootingsimulator.Bluetooth
{
    [ReactModule]
    public class BluetoothLEService
    {
        private BluetoothLEDevice _device;
        private IReadOnlyList<GattDeviceService> _deviceServices;
        private GattCharacteristicProperties _deviceProperties;

        #region TASKS

        /// <summary>
        /// Connect to a BLE device using a MAC address
        /// </summary>
        /// <param name="deviceId"></param>
        /// <returns></returns>
        [ReactMethod("connect")]
        public async Task<bool> Connect(string deviceAddress)
        {
            if (deviceAddress.Contains(":"))
            {
                deviceAddress = deviceAddress.Replace(":", "");
            }

            ulong address = ulong.Parse(deviceAddress, System.Globalization.NumberStyles.HexNumber);

            _device = await BluetoothLEDevice.FromBluetoothAddressAsync(address);

            if (_device == null)
            {
                throw new ArgumentNullException("Failed to find / connect to device");
            }

            return _device.ConnectionStatus == BluetoothConnectionStatus.Connected;
        }

        public async Task DiscoverServices()
        {
            if (_device == null)
            {
                throw new ArgumentNullException("Device not connected");
            }

            //GattDeviceServicesResult result = await _device.get
            // if (result.Status == GattCommunicationStatus.Success)
            //{
            //    _deviceServices = result.Services;
            //}
        }

        async Task<string> Read()
        {
            if (_deviceServices == null)
            {
                await DiscoverServices();
            }

            foreach (var service in _deviceServices)
            {
                GattCharacteristicsResult gcr = await service.GetCharacteristicsAsync();

                if (gcr.Status == GattCommunicationStatus.Success)
                {
                    foreach (var c in gcr.Characteristics)
                    {
                        if (c.CharacteristicProperties == GattCharacteristicProperties.Read)
                        {
                            GattReadResult grr = await c.ReadValueAsync();
                            if (grr.Status == GattCommunicationStatus.Success)
                            {
                                var reader = DataReader.FromBuffer(grr.Value);
                                byte[] input = new byte[reader.UnconsumedBufferLength];
                                reader.ReadBytes(input);
                                return "";
                            }
                        }
                    }
                }
            }
            return "";
        }

        /// <summary>
        /// Disconnects from BLE device
        /// </summary>
        /// <param name="deviceId"></param>
        /// <returns></returns>
        [ReactMethod("disconnect")]
        public async Task<bool> Disconnect(string deviceId)
        {
            _device.Dispose();
            return true;
        }

        /// <summary>
        /// Pair with BLE device with 
        /// </summary>
        /// <param name="deviceId"></param>
        /// <returns></returns>
        public async Task<bool> PairDevice(string deviceId)
        {
            var devices = await DeviceInformation.FindAllAsync(BluetoothLEDevice.GetDeviceSelector());
            foreach (var d in devices)
            {
                //TO DO: Confirm that DeviceInformation.Id is the mac address of the BluetoothLEDevice ID
                if (d.Id == deviceId)
                {
                    DevicePairingResult dpr = await d.Pairing.PairAsync();
                    return d.Pairing.IsPaired;
                }
            }
            return false;
        }

        #endregion

        #region EVENTS

        [ReactEvent("connectionSuccess")]
        public Action<string> ConnectionSuccess;

        [ReactEvent("connectionLost")]
        public Action<string> ConnectionLost;

        [ReactEvent("bluetoothEnabled")]
        public Action<string> BluetoothEnabled;

        [ReactEvent("bluetoothDisabled")]
        public Action<string> BluetoothDisabled;

        #endregion

    }
}
