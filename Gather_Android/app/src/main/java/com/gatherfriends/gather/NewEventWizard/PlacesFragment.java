package com.gatherfriends.gather.NewEventWizard;

import android.app.Activity;
import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;


import com.gatherfriends.gather.R;


public class PlacesFragment extends Fragment {

    IDataWrangler d;

    @Override
    public void onAttach(Activity activity){
        super.onAttach(activity);

        try{
            d = (IDataWrangler) getActivity();
        }catch(ClassCastException e){
            throw new ClassCastException(activity.toString()+" does not implement IDataWrangler");
        }

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        return inflater.inflate(R.layout.fragment_places, container, false);
    }
}
