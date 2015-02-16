package com.gatherfriends.gather.NewShindigWizard;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;

import android.app.FragmentTransaction;
import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.support.v7.app.ActionBarActivity;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.ProgressBar;

import com.gatherfriends.gather.R;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class NewShindigActivity extends ActionBarActivity implements IDataWrangler{

    //Used in the slider style android layout
    SectionsPagerAdapter mSectionsPagerAdapter;
    ViewPager mViewPager;


    private static final String LOG_TAG = "GatherApp";

    /**           GOOGLE API CONSTANTS                **/

    private static final String PLACES_API_BASE = "https://maps.googleapis.com/maps/api/place";
    private static final String TYPE_AUTOCOMPLETE = "/autocomplete";
    private static final String OUT_JSON = "/json";
    private static final String GEOCODE_API_BASE = "https://maps.googleapis.com/maps/api/geocode";
    private static final String API_KEY = "AIzaSyCqTDuTW_yD8XP-Bvd5KkzglpAgNePOw6s";

    /***************************************************/

    /**             VARIABLES                 **/

    private String chosenItem="";
    ArrayList<String> location=new ArrayList<>();
    ProgressBar progress;
    GoogleMap mMap;

    /*******************************************/


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_event);

        //Used for swiping sections of built in Android
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());
        mViewPager = (ViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        progress = new ProgressBar(this);
        progress.setIndeterminate(true);
        progress = (ProgressBar) findViewById(R.id.progress_bar);
        progress.setVisibility(View.VISIBLE);

    }

    private class GetLatitudeLongitude extends AsyncTask<Void, Void, Void>{

        @Override
        protected Void doInBackground(Void... params) {
            HttpURLConnection conn;
            StringBuilder jsonResults = new StringBuilder();

            try {
                //builds string to be used in API call to Geocode
                StringBuilder sb = new StringBuilder(GEOCODE_API_BASE + OUT_JSON);
                sb.append("?key=" + API_KEY);
                sb.append("&address=" + URLEncoder.encode(chosenItem, "utf8"));


                URL url = new URL(sb.toString());
                conn = (HttpURLConnection) url.openConnection();
                InputStreamReader in = new InputStreamReader(conn.getInputStream());

                // Load the results into a StringBuilder
                int read;
                char[] buff = new char[1024];
                while ((read = in.read(buff)) != -1) {
                    jsonResults.append(buff, 0, read);
                }
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                // Create a JSON object hierarchy from the results
                JSONObject jsonObj = new JSONObject(jsonResults.toString());
                JSONArray predsJsonArray = jsonObj.getJSONArray("results");
                JSONObject temp = new JSONObject(predsJsonArray.get(0).toString());
                temp = temp.getJSONObject("geometry");
                temp = temp.getJSONObject("location");

                location.add(temp.getString("lat"));
                location.add(temp.getString("lng"));



            } catch (JSONException e) {
                Log.e(LOG_TAG, "Cannot process JSON results", e);
            }

            onPostExecute();
            return null;
        }

        protected void onPostExecute(){
            //After we get lat and long for the place, make a marker on the map
            final float lat = Float.valueOf(location.get(0));
            final float lng = Float.valueOf(location.get(1));
            final LatLng USER_INPUT = new LatLng(lat, lng);

            Marker user_input = mMap.addMarker(new MarkerOptions()
                    .position(USER_INPUT)
                    .draggable(false));
        }
    }

    public void attachAutoComplete(){
        final AutoCompleteTextView autoCompView = (AutoCompleteTextView) findViewById(R.id.autocomplete);
        autoCompView.setAdapter(new PlacesAutoCompleteAdapter(this, R.layout.list_item));
        autoCompView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
                chosenItem = (String) adapterView.getItemAtPosition(position);
                GetLatitudeLongitude g = new GetLatitudeLongitude();
                g.execute();
            }
        });

        FragmentManager fragmentManager = getSupportFragmentManager();
        SupportMapFragment mapSupportFragment = (SupportMapFragment) fragmentManager.findFragmentById(R.id.map);
        mMap = mapSupportFragment.getMap();
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_new_event, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onNext(String s) {

    }

    public Context contextAccesor(){
        return this.getBaseContext();
    }


    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            switch (position) {
                case 0:
                    return new NameDateTimeFragment();
                case 1: {
                    return new PlacesFragment();
                }
            }
            return null;
        }

        @Override
        public int getCount() {
            // Show 2 total pages.
            return 2;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            switch (position) {
                case 0:
                    return "New Date & Time";
                case 1:
                    return "Places";
            }
            return null;
        }
    }

    private class PlacesAutoCompleteAdapter extends ArrayAdapter<String> implements Filterable {
        private ArrayList<String> resultList;

        public PlacesAutoCompleteAdapter(Context context, int textViewResourceId) {
            super(context, textViewResourceId);
        }

        @Override
        public int getCount() {
            return resultList.size();
        }

        @Override
        public String getItem(int index) {
            return resultList.get(index);
        }

        @Override
        public Filter getFilter() {
            Filter filter = new Filter() {
                @Override
                protected FilterResults performFiltering(CharSequence constraint) {
                    FilterResults filterResults = new FilterResults();
                    if (constraint != null && constraint.length()>3) {
                        // Retrieve the autocomplete results.
                        resultList = autocomplete(constraint.toString());

                        // Assign the data to the FilterResults
                        filterResults.values = resultList;
                        filterResults.count = resultList.size();
                    }
                    return filterResults;
                }

                @Override
                protected void publishResults(CharSequence constraint, FilterResults results) {
                    if (results != null && results.count > 0) {
                        notifyDataSetChanged();
                    }
                    else {
                        notifyDataSetInvalidated();
                    }
                }};
            return filter;
        }
    }

    private ArrayList<String> autocomplete(String input) {
        ArrayList<String> resultList = null;

        HttpURLConnection conn = null;
        StringBuilder jsonResults = new StringBuilder();
        try {
            StringBuilder sb = new StringBuilder(PLACES_API_BASE + TYPE_AUTOCOMPLETE + OUT_JSON);
            sb.append("?key=" + API_KEY);
            sb.append("&input=" + URLEncoder.encode(input, "utf8"));
            //  sb.append("&location;=42.3581,71.0636");
            //  sb.append("&radius;=1000");


            URL url = new URL(sb.toString());
            conn = (HttpURLConnection) url.openConnection();
            InputStreamReader in = new InputStreamReader(conn.getInputStream());

            // Load the results into a StringBuilder
            int read;
            char[] buff = new char[1024];
            while ((read = in.read(buff)) != -1) {
                jsonResults.append(buff, 0, read);
            }
        } catch (MalformedURLException e) {
            Log.e(LOG_TAG, "Error processing Places API URL", e);
            return resultList;
        } catch (IOException e) {
            Log.e(LOG_TAG, "Error connecting to Places API", e);
            return resultList;
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }

        try {
            // Create a JSON object hierarchy from the results
            JSONObject jsonObj = new JSONObject(jsonResults.toString());
            JSONArray predsJsonArray = jsonObj.getJSONArray("predictions");

            // Extract the Place descriptions from the results
            resultList = new ArrayList<String>(predsJsonArray.length());
            for (int i = 0; i < predsJsonArray.length(); i++) {
                resultList.add(predsJsonArray.getJSONObject(i).getString("description"));
            }
        } catch (JSONException e) {
            Log.e(LOG_TAG, "Cannot process JSON results", e);
        }

        return resultList;
    }

    public void stopLoadingCircle(){
        progress.setVisibility(View.INVISIBLE);
    }

}
